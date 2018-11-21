import { createReducer } from '../utils/redux';
import { AccountTypes } from '../utils/constants';
import round from 'lodash.round';

import { toNum } from '../utils/misc';
import { ETH, MKR } from '../chain/maker';

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

// Constants ----------------------------------------------

const ONBOARDING_OPEN = 'onboarding/ONBOARDING_OPEN';
const ONBOARDING_CLOSE = 'onboarding/ONBOARDING_CLOSE';
const ONBOARDING_NEXT_STEP = 'onboarding/ONBOARDING_NEXT_STEP';
const ONBOARDING_PREV_STEP = 'onboarding/ONBOARDING_PREV_STEP';
const ONBOARDING_CHOOSE_WALLET_TYPE =
  'onboarding/ONBOARDING_CHOOSE_WALLET_TYPE';
const ONBOARDING_START_LINKED_FLOW = 'onboarding/ONBOARDING_START_LINKED_FLOW';
const ONBOARDING_SET_HOT_WALLET = 'onboarding/ONBOARDING_SET_HOT_WALLET';
const ONBOARDING_SET_COLD_WALLET = 'onboarding/ONBOARDING_SET_COLD_WALLET';
const ONBOARDING_METAMASK_WALLET_CONNECTED =
  'onboarding/ONBOARDING_METAMASK_WALLET_CONNECTED';
const ONBOARDING_METAMASK_WALLET_CONNECTING =
  'onboarding/ONBOARDING_METAMASK_WALLET_CONNECTING';
const ONBOARDING_METAMASK_WALLET_CONNECTION_FAILED =
  'onboarding/ONBOARDING_METAMASK_WALLET_CONNECTION_FAILED';
const ONBOARDING_HARDWARE_WALLET_CONNECTED =
  'onboarding/ONBOARDING_HARDWARE_WALLET_CONNECTED';
const ONBOARDING_HARDWARE_WALLET_CONNECTING =
  'onboarding/ONBOARDING_HARDWARE_WALLET_CONNECTING';
const ONBOARDING_HARDWARE_WALLET_CONNECTION_FAILED =
  'onboarding/ONBOARDING_HARDWARE_WALLET_CONNECTION_FAILED';

// Actions ------------------------------------------------

export const onboardingOpen = () => ({
  type: ONBOARDING_OPEN
});

export const onboardingClose = () => ({
  type: ONBOARDING_CLOSE
});

export const onboardingNextStep = () => ({
  type: ONBOARDING_NEXT_STEP
});

export const onboardingPrevStep = () => ({
  type: ONBOARDING_PREV_STEP
});

export const onboardingChooseWalletType = () => ({
  type: ONBOARDING_CHOOSE_WALLET_TYPE
});

export const onboardingStartLinkedFlow = () => ({
  type: ONBOARDING_START_LINKED_FLOW
});

export const setHotWallet = account => ({
  type: ONBOARDING_SET_HOT_WALLET,
  payload: {
    account
  }
});

export const resetHotWallet = () => ({
  type: ONBOARDING_SET_HOT_WALLET,
  payload: {}
});

export const setColdWallet = account => ({
  type: ONBOARDING_SET_COLD_WALLET,
  payload: {
    account
  }
});

export const resetColdWallet = () => ({
  type: ONBOARDING_SET_COLD_WALLET,
  payload: {}
});

export const useMetamaskAccount = () => async (dispatch, getState) => {
  dispatch({
    type: ONBOARDING_METAMASK_WALLET_CONNECTING
  });

  const {
    accounts: { allAccounts }
  } = getState();

  const metamaskAccount = allAccounts.find(
    acct => acct.type === 'provider' || acct.type === 'browser'
  );

  if (metamaskAccount) {
    try {
      const accountInfo = await getInfoFromAddress(metamaskAccount.address);

      dispatch({
        type: ONBOARDING_METAMASK_WALLET_CONNECTED
      });
      dispatch(
        setHotWallet({
          ...accountInfo,
          accountType: AccountTypes.METAMASK
        })
      );
    } catch (err) {
      console.error(err);
      dispatch({
        type: ONBOARDING_METAMASK_WALLET_CONNECTION_FAILED
      });
    }
  }
};

export const useHardwareAccount = (account, asHotOrCold) => (
  dispatch,
  getState
) => {
  const {
    onboarding: { onHardwareAccountChosen }
  } = getState();

  if (asHotOrCold === 'hot') {
    dispatch(setHotWallet(account));
  } else {
    dispatch(setColdWallet(account));
  }

  onHardwareAccountChosen(account.address);
};

export const connectHardwareWallet = (
  accountType,
  options = {}
) => async dispatch => {
  dispatch({
    type: ONBOARDING_HARDWARE_WALLET_CONNECTING
  });

  let path;
  if (accountType === AccountTypes.LEDGER && options.live) {
    path = LEDGER_LIVE_PATH;
  } else if (accountType === AccountTypes.LEDGER && !options.live) {
    path = LEDGER_LEGACY_PATH;
  }

  const onChoose = async (addresses, callback) => {
    try {
      const accounts = await Promise.all(
        (addresses || []).map(getInfoFromAddress)
      );

      dispatch({
        type: ONBOARDING_HARDWARE_WALLET_CONNECTED,
        payload: {
          accounts: accounts.map(account => ({
            ...account,
            accountType
          })),
          onAccountChosen: callback
        }
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: ONBOARDING_HARDWARE_WALLET_CONNECTION_FAILED
      });
    }
  };

  try {
    await window.maker.addAccount({
      type: accountType,
      path: path,
      accountsLength: 5,
      choose: onChoose
    });
  } catch (err) {
    console.error(err);
    dispatch({
      type: ONBOARDING_HARDWARE_WALLET_CONNECTION_FAILED
    });
  }
};

// Helpers ------------------------------------------------

const getInfoFromAddress = async address => {
  return {
    address,
    eth: round(await toNum(window.maker.getToken(ETH).balanceOf(address)), 3),
    mkr: round(await toNum(window.maker.getToken(MKR).balanceOf(address)), 3)
  };
};

// Reducer ------------------------------------------------

const initialState = {
  step: 1,
  open: true,
  flow: 'linked',
  hotWallet: null,
  coldWallet: null,
  availableAccounts: [],
  onHardwareAccountChosen: () => {},
  connecting: false
};

const onboarding = createReducer(initialState, {
  [ONBOARDING_OPEN]: state => ({
    ...state,
    open: true
  }),
  [ONBOARDING_CLOSE]: state => ({
    ...state,
    open: false
  }),
  [ONBOARDING_NEXT_STEP]: state => ({
    ...state,
    step: state.step + 1
  }),
  [ONBOARDING_PREV_STEP]: state => ({
    ...state,
    step: state.step - 1
  }),
  [ONBOARDING_CHOOSE_WALLET_TYPE]: state => ({
    ...state,
    flow: null
  }),
  [ONBOARDING_START_LINKED_FLOW]: state => ({
    ...state,
    flow: 'linked'
  }),
  [ONBOARDING_SET_HOT_WALLET]: (state, { payload }) => ({
    ...state,
    hotWallet: payload.account
  }),
  [ONBOARDING_SET_COLD_WALLET]: (state, { payload }) => ({
    ...state,
    coldWallet: payload.account
  }),
  [ONBOARDING_METAMASK_WALLET_CONNECTING]: state => ({
    ...state,
    connecting: true
  }),
  [ONBOARDING_METAMASK_WALLET_CONNECTED]: state => ({
    ...state,
    connecting: false
  }),
  [ONBOARDING_METAMASK_WALLET_CONNECTION_FAILED]: state => ({
    ...state,
    connecting: false
  }),
  [ONBOARDING_HARDWARE_WALLET_CONNECTED]: (state, { payload }) => ({
    ...state,
    availableAccounts: payload.accounts,
    onHardwareAccountChosen: payload.onAccountChosen,
    connecting: false
  }),
  [ONBOARDING_HARDWARE_WALLET_CONNECTING]: state => ({
    ...state,
    availableAccounts: [],
    onHardwareAccountChosen: () => {},
    connecting: true
  }),
  [ONBOARDING_HARDWARE_WALLET_CONNECTION_FAILED]: state => ({
    ...state,
    connecting: false
  })
});

export default onboarding;
