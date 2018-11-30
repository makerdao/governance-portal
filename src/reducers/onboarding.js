import { createReducer } from '../utils/redux';
import { BREAK_LINK_SUCCESS } from './proxy';
import { SET_ACTIVE_ACCOUNT } from './accounts';

// Constants ----------------------------------------------

const ONBOARDING_OPEN = 'onboarding/ONBOARDING_OPEN';
const ONBOARDING_CLOSE = 'onboarding/ONBOARDING_CLOSE';
const ONBOARDING_NEXT_STEP = 'onboarding/ONBOARDING_NEXT_STEP';
const ONBOARDING_PREV_STEP = 'onboarding/ONBOARDING_PREV_STEP';
const ONBOARDING_TO_STEP = 'onboarding/ONBOARDING_TO_STEP';
const ONBOARDING_CHOOSE_WALLET_TYPE =
  'onboarding/ONBOARDING_CHOOSE_WALLET_TYPE';
const ONBOARDING_START_LINKED_FLOW = 'onboarding/ONBOARDING_START_LINKED_FLOW';
const ONBOARDING_SET_HOT_WALLET = 'onboarding/ONBOARDING_SET_HOT_WALLET';
const ONBOARDING_SET_COLD_WALLET = 'onboarding/ONBOARDING_SET_COLD_WALLET';
const ONBOARDING_SET_STATE = 'onboarding/ONBOARDING_SET_STATE';

export const OnboardingStates = {
  INTRODUCTION: 'introduction',
  SETUP_LINKED_WALLET: 'linked',
  FINISHED: 'finished'
};

// Actions ------------------------------------------------

export const onboardingOpen = () => ({
  type: ONBOARDING_OPEN
});

export const onboardingClose = () => ({
  type: ONBOARDING_CLOSE
});

export const onboardingToStep = step => ({
  type: ONBOARDING_TO_STEP,
  payload: {
    step
  }
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

export const setOnboardingState = state => ({
  type: ONBOARDING_SET_STATE,
  payload: {
    state
  }
});

// Reducer ------------------------------------------------

const initialState = {
  step: 0,
  open: false,
  state: OnboardingStates.INTRODUCTION,
  hotWallet: {
    address: '0xd90b1122376F44e3d00a62C409F1b105950869b5',
    type: 'metamask'
  },
  coldWallet: {
    address: '0x1b2bc31a10d8e20f111d9a00aeb5ee96de75a418',
    type: 'trezor',
    mkrBalance: 0.075
  }
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
  [ONBOARDING_TO_STEP]: (state, { payload }) => ({
    ...state,
    step: payload.step
  }),
  [ONBOARDING_NEXT_STEP]: state => ({
    ...state,
    step: state.step + 1
  }),
  [ONBOARDING_PREV_STEP]: state => ({
    ...state,
    step: state.step - 1
  }),
  [ONBOARDING_SET_STATE]: (state, { payload }) => ({
    ...state,
    state: payload.state
  }),
  [ONBOARDING_SET_HOT_WALLET]: (state, { payload }) => ({
    ...state,
    hotWallet: payload.account
  }),
  [ONBOARDING_SET_COLD_WALLET]: (state, { payload }) => ({
    ...state,
    coldWallet: payload.account
  }),
  [BREAK_LINK_SUCCESS]: state => ({
    ...state,
    state: OnboardingStates.INTRODUCTION
  }),
  [SET_ACTIVE_ACCOUNT]: (state, { payload: { newAccount } }) => ({
    ...state,
    ...(() => {
      if (!state.hotWallet || !state.coldWallet) {
        // not onboarding - we can chill out
      } else if (
        state.hotWallet.address === newAccount.address ||
        state.coldWallet.address === newAccount.address
      ) {
        // do nothing! we can continue onboarding where we left off.
      } else if (newAccount.hasProxy && newAccount.proxyRole === 'hot') {
        // we need access to the cold account to continue set up, so we're done here.
        return { state: OnboardingStates.FINISHED };
      } else if (
        newAccount.hasProxy &&
        newAccount.proxyRole === 'cold' &&
        newAccount.proxy.hasInfMkrApproval
      ) {
        // we don't rely on onboarding for depositing MKR.
        return { state: OnboardingStates.FINISHED };
      } else if (
        newAccount.hasProxy &&
        newAccount.proxyRole === 'cold' &&
        !newAccount.proxy.hasInfMkrApproval
      ) {
        // Now we're talking! We can pick up where they left off.
        return {
          state: OnboardingStates.SETUP_LINKED_WALLET,
          hotWallet: newAccount.proxy.linkedAccount,
          coldWallet: newAccount,
          step: 3
        };
      } else {
        return {
          state: OnboardingStates.INTRODUCTION,
          hotWallet: null,
          coldWallet: null,
          step: 0
        };
      }
    })()
  })
});

export default onboarding;
