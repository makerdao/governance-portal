import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import differenceWith from 'ramda/src/differenceWith';

import { createReducer } from '../utils/redux';
import { AccountTypes } from '../utils/constants';
import {
  add,
  eq,
  subtract,
  toNum,
  promiseRetry,
  promisedProperties,
  addMkrAndEthBalance
} from '../utils/misc';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  MKR_APPROVE_SUCCESS,
  IOU_APPROVE_SUCCESS
} from './sharedProxyConstants';
import { MAX_UINT_ETH_BN, getUrlParam } from '../utils/ethereum';
import { MKR } from '../chain/maker';

// Constants ----------------------------------------------

const usingTestchain = !!getUrlParam('testchain_id');
const CHIEF = usingTestchain ? 'MCD_ADM' : 'CHIEF';

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
const DEFAULT_ACCOUNTS_PER_PAGE = 5;

const REMOVE_ACCOUNTS = 'accounts/REMOVE_ACCOUNTS';
export const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
export const FETCHING_ACCOUNT_DATA = 'accounts/FETCHING_ACCOUNT_DATA';
export const UPDATE_ACCOUNT = 'accounts/UPDATE_ACCOUNT';
export const ADD_ACCOUNT = 'accounts/ADD_ACCOUNT';
const SET_UNLOCKED_MKR = 'accounts/SET_UNLOCKED_MKR';
export const NO_METAMASK_ACCOUNTS = 'accounts/NO_METAMASK_ACCOUNTS';

export const HARDWARE_ACCOUNTS_CONNECTING =
  'accounts/HARDWARE_ACCOUNTS_CONNECTING';
export const HARDWARE_ACCOUNTS_CONNECTED =
  'accounts/HARDWARE_ACCOUNTS_CONNECTED';
export const HARDWARE_ACCOUNTS_ERROR = 'accounts/HARDWARE_ACCOUNTS_ERROR';

export const HARDWARE_ACCOUNT_CONNECTED = 'accounts/HARDWARE_ACCOUNT_CONNECTED';
export const HARDWARE_ACCOUNT_ERROR = 'accounts/HARDWARE_ACCOUNT_ERROR';

// Selectors ----------------------------------------------

export function getAccount(state, address) {
  return state.accounts.allAccounts.find(a => eq(a.address, address));
}

export function getActiveAccount(state) {
  return getAccount(state, state.accounts.activeAccount);
}

export function getActiveVotingFor(state) {
  const activeAccount = getActiveAccount(state);
  if (
    !activeAccount ||
    (!activeAccount.hasProxy && !activeAccount.singleWallet) ||
    !(activeAccount.proxy.votingPower > 0)
  )
    return [];
  return activeAccount.votingFor;
}

export function activeCanVote(state) {
  const activeAccount = getActiveAccount(state);
  return (
    activeAccount &&
    (activeAccount.hasProxy || activeAccount.singleWallet) &&
    parseFloat(activeAccount.proxy.votingPower) > 0
  );
}

// Actions ------------------------------------------------

export const addAccounts = accounts => async dispatch => {
  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: true });

  for (let account of accounts) {
    const mkrToken = window.maker.getToken(MKR);
    const iouToken = window.maker.getToken('IOU');

    const { hasProxy, voteProxy } = await window.maker
      .service('voteProxy')
      .getVoteProxy(account.address);

    const proxyRole = hasProxy
      ? voteProxy.getColdAddress() === account.address
        ? 'cold'
        : 'hot'
      : '';

    let currProposal = Promise.resolve([]);
    if (hasProxy) {
      currProposal = currProposal
        .then(() =>
          promiseRetry({
            fn: () => voteProxy.getVotedProposalAddresses()
          })
        )
        .then(addresses =>
          (addresses || []).map(address => address.toLowerCase())
        );
    }

    const chiefAddress = window.maker
      .service('smartContract')
      .getContractAddressByName(CHIEF);

    const linkedAccountData = async () => {
      const otherRole = proxyRole === 'hot' ? 'cold' : 'hot';
      const linkedAddress =
        otherRole === 'hot'
          ? voteProxy.getHotAddress()
          : voteProxy.getColdAddress();
      return {
        proxyRole: otherRole,
        address: linkedAddress,
        mkrBalance: await toNum(mkrToken.balanceOf(linkedAddress))
      };
    };

    const _payload = {
      ...account,
      address: account.address,
      mkrBalance: toNum(
        promiseRetry({ fn: () => mkrToken.balanceOf(account.address) })
      ),
      hasProxy,
      proxyRole: proxyRole,
      votingFor: currProposal,
      hasInfMkrApproval: mkrToken
        .allowance(account.address, chiefAddress)
        .then(val => val.eq(MAX_UINT_ETH_BN)),
      hasInfIouApproval: iouToken
        .allowance(account.address, chiefAddress)
        .then(val => val.eq(MAX_UINT_ETH_BN)),
      proxy: hasProxy
        ? promisedProperties({
            address: voteProxy.getProxyAddress(),
            votingPower: toNum(voteProxy.getNumDeposits()),
            hasInfMkrApproval: mkrToken
              .allowance(account.address, voteProxy.getProxyAddress())
              .then(val => val.eq(MAX_UINT_ETH_BN)),
            linkedAccount: linkedAccountData()
          })
        : {
            address: '',
            votingPower: 0,
            hasInfIouApproval: false,
            hasInfMkrApproval: false,
            linkedAccount: {}
          }
    };

    try {
      const payload = await promisedProperties(_payload);
      dispatch({ type: ADD_ACCOUNT, payload });
    } catch (e) {
      console.error('failed to add account', e);
    }
  }

  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: false });
};

export const addSingleWalletAccount = account => async dispatch => {
  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: true });

  const chiefAddress = window.maker
    .service('smartContract')
    .getContractAddressByName(CHIEF);

  const mkrToken = window.maker.getToken(MKR);
  const iouToken = window.maker.getToken('IOU');

  const chiefService = window.maker.service('chief');

  const currProposal = (async () => {
    const _slate = await chiefService.getVotedSlate(account.address);
    const slateAddresses = await chiefService.getSlateAddresses(_slate);
    return (slateAddresses || []).map(address => address.toLowerCase());
  })();

  const votingPower = (await chiefService.getNumDeposits(
    account.address
  )).toNumber();

  const hasInfMkrApproval = (await mkrToken.allowance(
    account.address,
    chiefAddress
  )).eq(MAX_UINT_ETH_BN);

  const hasInfIouApproval = (await iouToken.allowance(
    account.address,
    chiefAddress
  )).eq(MAX_UINT_ETH_BN);

  const _payload = {
    ...account,
    address: account.address,
    mkrBalance: promiseRetry({
      fn: async () => (await mkrToken.balanceOf(account.address)).toFixed()
    }),
    hasProxy: false,
    singleWallet: true,
    proxyRole: '',
    votingFor: currProposal,
    hasInfMkrApproval,
    hasInfIouApproval,
    proxy: {
      votingPower,
      address: account.address,
      hasInfMkrApproval,
      hasInfIouApproval,
      linkedAccount: ''
    }
  };

  try {
    const payload = await promisedProperties(_payload);
    dispatch({ type: ADD_ACCOUNT, payload });
  } catch (e) {
    console.error('failed to add account', e);
  }

  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: false });
};

export const addAccount = account => async dispatch => {
  const { hasProxy } = await window.maker
    .service('voteProxy')
    .getVoteProxy(account.address);

  const numDeposits = await window.maker
    .service('chief')
    .getNumDeposits(account.address);

  // if we don't have a vote proxy, but we have locked MKR, we must be voting with a single wallet
  if (!hasProxy && numDeposits.toNumber() > 0) {
    return await dispatch(addSingleWalletAccount(account));
  } else {
    return await dispatch(addAccounts([account]));
  }
};

export const removeAccounts = accounts => ({
  type: REMOVE_ACCOUNTS,
  payload: accounts
});

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: account
});

export const addMetamaskAccount = address => async (dispatch, getState) => {
  // Only add new accounts that we haven't seen before
  if (getAccount(getState(), address)) return;

  try {
    await window.maker
      .service('accounts')
      .addAccount({ type: AccountTypes.METAMASK });
    return dispatch(addAccount({ address, type: AccountTypes.METAMASK }));
  } catch (error) {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
  }
};

export const setActiveAccount = address => async (dispatch, getState) => {
  const state = getState();

  try {
    window.maker.useAccountWithAddress(address);
    return dispatch({
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: getAccount(state, address),
        // unfortunately the only way I can think of (short of redoing the whole proxy store data design)
        // to make sure the proxy store retains transaction information when you're only toggling between
        // hot and cold accounts. This is so they can resume onboarding without any issues.
        onboardingHotAddress:
          state.onboarding.hotWallet && state.onboarding.hotWallet.address,
        onboardingColdAddress:
          state.onboarding.coldWallet && state.onboarding.coldWallet.address
      }
    });
  } catch (err) {
    // Do nothing.
  }
};

export const connectHardwareAccounts = (
  accountType,
  options = {}
) => dispatch => {
  dispatch({
    type: HARDWARE_ACCOUNTS_CONNECTING
  });

  let path;
  if (accountType === AccountTypes.LEDGER && options.live) {
    path = LEDGER_LIVE_PATH;
  } else if (accountType === AccountTypes.LEDGER && !options.live) {
    path = LEDGER_LEGACY_PATH;
  }

  return new Promise((resolve, reject) => {
    const onChoose = async (addresses, callback) => {
      const accountsWithType = await Promise.all(
        addresses.map(address =>
          addMkrAndEthBalance({
            address,
            type: accountType
          })
        )
      );

      dispatch({
        type: HARDWARE_ACCOUNTS_CONNECTED,
        payload: {
          onAccountChosen: callback
        }
      });

      resolve(accountsWithType);
    };

    window.maker
      .addAccount({
        type: accountType,
        path: path,
        accountsOffset: options.offset || 0,
        accountsLength: options.accountsPerPage || DEFAULT_ACCOUNTS_PER_PAGE,
        choose: onChoose
      })
      .catch(err => {
        dispatch({
          type: HARDWARE_ACCOUNTS_ERROR
        });
        reject(err);
      });
  });
};

export const addHardwareAccount = (address, accountType) => async (
  dispatch,
  getState
) => {
  try {
    const {
      accounts: { onHardwareAccountChosen }
    } = getState();

    await onHardwareAccountChosen(null, address);

    // add hardware account to maker object
    await dispatch(
      addAccount({
        address,
        type: accountType
      })
    );

    return dispatch({
      type: HARDWARE_ACCOUNT_CONNECTED
    });
  } catch (err) {
    return dispatch({
      type: HARDWARE_ACCOUNT_ERROR
    });
  }
};

// Reducer ------------------------------------------------

// Reducer helpers
const uniqByAddress = uniqWith((a, b) => a.address === b.address);
const uniqConcat = pipe(
  concat,
  uniqByAddress
);
const addressCmp = (x, y) => x.address === y.address;
const withUpdatedAccount = (accounts, updatedAccount) => {
  return accounts.map(account =>
    account.address === updatedAccount.address &&
    account.type === updatedAccount.type
      ? {
          ...account,
          ...updatedAccount
        }
      : account
  );
};

const initialState = {
  activeAccount: '',
  fetching: true,
  allAccounts: [],
  onHardwareAccountChosen: () => {}
};

const updateProxyBalance = adding => (state, { payload: amount }) => {
  let account = getActiveAccount({ accounts: state });
  if (!adding) {
    if (typeof amount === 'number') amount = -1 * amount;
    if (typeof amount === 'string') amount = '-' + amount;
  }

  account = {
    ...account,
    mkrBalance: subtract(account.mkrBalance, amount),
    proxy: {
      ...account.proxy,
      linkedAccount: {
        ...account.proxy.linkedAccount,
        mkrBalance:
          account.proxyRole === 'hot'
            ? subtract(account.proxy.linkedAccount.mkrBalance, amount)
            : account.proxy.linkedAccount.mkrBalance
      },
      votingPower: add(account.proxy.votingPower, amount)
    }
  };

  let allAccounts = withUpdatedAccount(state.allAccounts, account);

  let linkedAccount = getAccount(
    { accounts: state },
    account.proxy.linkedAccount.address
  );
  if (linkedAccount) {
    linkedAccount = {
      ...linkedAccount,
      proxy: {
        ...linkedAccount.proxy,
        linkedAccount: {
          ...linkedAccount.proxy.linkedAccount, // TODO: maybe just refresh  account data via fetches, this is slightly confusing
          mkrBalance:
            linkedAccount.proxyRole === 'cold'
              ? subtract(account.mkrBalance, amount)
              : account.mkrBalance
        },
        votingPower: add(linkedAccount.proxy.votingPower, amount)
      }
    };
    allAccounts = withUpdatedAccount(allAccounts, linkedAccount);
  }

  return { ...state, allAccounts };
};

const accounts = createReducer(initialState, {
  [REMOVE_ACCOUNTS]: (state, { payload: accounts }) => ({
    ...state,
    allAccounts: differenceWith(addressCmp, state.allAccounts, accounts)
  }),
  [UPDATE_ACCOUNT]: (state, { payload: updatedAccount }) => ({
    ...state,
    allAccounts: withUpdatedAccount(state.allAccounts, updatedAccount)
  }),
  [ADD_ACCOUNT]: (state, { payload: account }) => {
    if (!Object.values(AccountTypes).includes(account.type)) {
      throw new Error(`Unrecognized account type: "${account.type}"`);
    }

    return {
      ...state,
      allAccounts: uniqConcat([account], state.allAccounts)
    };
  },
  [SET_ACTIVE_ACCOUNT]: (state, { payload: { newAccount } }) => ({
    ...state,
    allAccounts: state.allAccounts,
    activeAccount: newAccount.address
  }),
  [SET_UNLOCKED_MKR]: (state, { payload }) => ({
    ...state,
    activeAccountUnlockedMkr: payload.mkr
  }),
  [FETCHING_ACCOUNT_DATA]: (state, { payload }) => ({
    ...state,
    fetching: payload
  }),
  [NO_METAMASK_ACCOUNTS]: state => ({
    ...state,
    fetching: false
  }),
  [MKR_APPROVE_SUCCESS]: (state, { payload }) => {
    const account = getAccount(
      { accounts: state },
      window.maker.currentAddress()
    );

    const updatedAccount =
      payload === 'single-wallet'
        ? {
            ...account,
            hasInfMkrApproval: true
          }
        : {
            ...account,
            proxy: { ...account.proxy, hasInfMkrApproval: true }
          };

    return {
      ...state,
      allAccounts: withUpdatedAccount(state.allAccounts, updatedAccount)
    };
  },
  [IOU_APPROVE_SUCCESS]: state => {
    const account = getAccount(
      { accounts: state },
      window.maker.currentAddress()
    );
    const updatedAccount = {
      ...account,
      hasInfIouApproval: true
    };
    return {
      ...state,
      allAccounts: withUpdatedAccount(state.allAccounts, updatedAccount)
    };
  },
  [SEND_MKR_TO_PROXY_SUCCESS]: updateProxyBalance(true),
  [WITHDRAW_MKR_SUCCESS]: updateProxyBalance(false),
  [HARDWARE_ACCOUNTS_CONNECTING]: (state, { payload }) => {
    return {
      ...state,
      onHardwareAccountChosen: () => {}
    };
  },
  [HARDWARE_ACCOUNTS_CONNECTED]: (state, { payload }) => {
    return {
      ...state,
      onHardwareAccountChosen: payload.onAccountChosen
    };
  },
  [HARDWARE_ACCOUNTS_ERROR]: state => {
    return state;
  },
  [HARDWARE_ACCOUNT_CONNECTED]: (state, { payload }) => {
    return {
      ...state,
      onHardwareAccountChosen: () => {}
    };
  },
  [HARDWARE_ACCOUNT_ERROR]: state => {
    return state;
  }
});

export default accounts;
