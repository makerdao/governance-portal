import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import differenceWith from 'ramda/src/differenceWith';
import pick from 'ramda/src/pick';

import { createReducer } from '../utils/redux';
import {
  getMkrBalance,
  getProxyStatus,
  getLinkedAddress,
  getVotingPower,
  getVotedSlate,
  getSlateAddresses,
  getNumDeposits
} from '../chain/read';
import { AccountTypes } from '../utils/constants';
import { add, eq, subtract, promisedProperties } from '../utils/misc';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  INITIATE_LINK_REQUEST,
  APPROVE_LINK_SUCCESS
} from './proxy';
import { createSubProvider } from '../chain/hw-wallet';
import { netNameToId } from '../utils/ethereum';
import { toChecksum } from '../chain/web3';
import values from 'ramda/src/values';

// Constants ----------------------------------------------

const REMOVE_ACCOUNTS = 'accounts/REMOVE_ACCOUNTS';
const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
const FETCHING_ACCOUNT_DATA = 'accounts/FETCHING_ACCOUNT_DATA';
export const UPDATE_ACCOUNT = 'accounts/UPDATE_ACCOUNT';
const ADD_ACCOUNT = 'accounts/ADD_ACCOUNT';
const SET_UNLOCKED_MKR = 'accounts/SET_UNLOCKED_MKR';
const FIND_HARDWARE_ACCOUNT = 'accounts/FIND_HARDWARE_ACCOUNT';
const FIND_HARDWARE_ACCOUNT_FAILURE = 'accounts/FIND_HARDWARE_ACCOUNT_FAILURE';
export const NO_METAMASK_ACCOUNTS = 'accounts/NO_METAMASK_ACCOUNTS';

// Selectors ----------------------------------------------

export function getAccount(state, address) {
  return state.accounts.allAccounts.find(a => eq(a.address, address));
}

export function getActiveAccount(state) {
  return getAccount(state, state.accounts.activeAccount);
}

export function getActiveVotingFor(state) {
  const activeAccount = getActiveAccount(state);
  return activeAccount ? activeAccount.votingFor : '';
}

export function activeCanVote(state) {
  const activeAccount = getActiveAccount(state);
  return (
    activeAccount &&
    activeAccount.hasProxy &&
    parseFloat(activeAccount.proxy.votingPower) > 0
  );
}

// Actions ------------------------------------------------

export const addAccounts = accounts => async dispatch => {
  dispatch({
    type: FETCHING_ACCOUNT_DATA,
    payload: true
  });
  for (let account of accounts) {
    const {
      hasProxy,
      type: proxyRole,
      address: proxyAddress
    } = await getProxyStatus(account.address);
    let currProposal = Promise.resolve('');
    if (hasProxy) {
      currProposal = currProposal.then(() =>
        Promise.all([
          getNumDeposits(proxyAddress),
          (async () => {
            const slate = await getVotedSlate(proxyAddress);
            const addresses = await getSlateAddresses(slate);
            return addresses[0] || '';
          })()
        ]).then(
          // NOTE for now we just take the first address in the slate since we're
          // assuming that they're only voting for one in the frontend. This
          // should be changed if that changes
          // also, if there's nothing locked in chief, we take this adddress as not voting for anything
          ([deposits, addresses]) => (Number(deposits) === 0 ? '' : addresses)
        )
      );
    }
    const _payload = {
      ...account,
      address: toChecksum(account.address),
      mkrBalance: getMkrBalance(account.address),
      hasProxy,
      proxyRole,
      votingFor: currProposal,
      proxy: (async () => ({
        address: hasProxy ? toChecksum(proxyAddress) : '',
        votingPower: hasProxy ? await getVotingPower(proxyAddress) : 0
      }))()
    };
    const fetchLinkedAccountData = async () => {
      if (hasProxy) {
        const otherRole = proxyRole === 'hot' ? 'cold' : 'hot';
        const linkedAddress = await getLinkedAddress(proxyAddress, otherRole);
        return {
          address: linkedAddress,
          proxyRole: otherRole,
          mkrBalance: await getMkrBalance(linkedAddress)
        };
      } else return {};
    };
    const [payload, linkedAccount] = await Promise.all([
      promisedProperties(_payload),
      fetchLinkedAccountData()
    ]);
    payload.proxy.linkedAccount = { ...linkedAccount };
    await dispatch({ type: ADD_ACCOUNT, payload });
  }
  return dispatch({ type: FETCHING_ACCOUNT_DATA, payload: false });
};

export const addAccount = account => async dispatch => {
  return dispatch(addAccounts([account]));
};

export const removeAccounts = accounts => ({
  type: REMOVE_ACCOUNTS,
  payload: accounts
});

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: account
});

// After the initial load, this will generally be called when an account
// is selected in the account box dropdown
export const setActiveAccount = address => ({
  type: SET_ACTIVE_ACCOUNT,
  payload: address
});

export const getHardwareAccount = type => async (dispatch, getState) => {
  dispatch({ type: FIND_HARDWARE_ACCOUNT });
  const subprovider = createSubProvider(type, {
    networkId: netNameToId(getState().metamask.network),
    promisify: true
  });
  try {
    const addressesMap = await subprovider.getAccounts();
    const address = values(addressesMap)[0];
    dispatch(addAccount({ address, type, subprovider }));
  } catch (err) {
    console.error(err);
    dispatch({ type: FIND_HARDWARE_ACCOUNT_FAILURE, payload: err });
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
  return accounts.map(
    account =>
      account.address === updatedAccount.address &&
      account.type === updatedAccount.type
        ? {
            ...account,
            ...updatedAccount
          }
        : account
  );
};

export const fakeAccount = {
  address: '0xbeefed1bedded2dabbed3defaced4decade5dead',
  type: 'fake',
  hasProxy: true,
  proxyRole: 'hot',
  votingFor: '0xbeefed1bedded2dabbed3defaced4decade5feed',
  mkrBalance: 333,
  proxy: {
    address: '0xproxyfake',
    votingPower: 111,
    linkedAccount: {
      address: '0xbeefed1bedded2dabbed3defaced4decade5feed',
      proxyRole: 'cold',
      mkrBalance: 222
    }
  }
};

const initialState = {
  activeAccount: '',
  fetching: true,
  // activeAccount: '0xbeefed1bedded2dabbed3defaced4decade5dead', // just for dev
  allAccounts: [
    // fakeAccount
  ]
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
    if (!Object.keys(AccountTypes).includes(account.type)) {
      throw new Error(`Unrecognized account type: "${account.type}"`);
    }

    return {
      ...state,
      allAccounts: uniqConcat([account], state.allAccounts)
    };
  },
  [SET_ACTIVE_ACCOUNT]: (state, { payload: address }) => ({
    ...state,
    allAccounts: state.allAccounts,
    activeAccount: address
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
  [SEND_MKR_TO_PROXY_SUCCESS]: updateProxyBalance(true),
  [WITHDRAW_MKR_SUCCESS]: updateProxyBalance(false),
  [INITIATE_LINK_REQUEST]: (state, { payload }) => {
    const hotAccount = {
      ...getAccount({ accounts: state }, payload.hotAddress),
      proxyRole: 'hot'
    };

    const coldAccount = {
      ...getAccount({ accounts: state }, payload.coldAddress),
      proxyRole: 'cold'
    };

    return {
      ...state,
      allAccounts: withUpdatedAccount(
        withUpdatedAccount(state.allAccounts, hotAccount),
        coldAccount
      )
    };
  },

  [APPROVE_LINK_SUCCESS]: (state, { payload }) => {
    let hotAccount = getAccount({ accounts: state }, payload.hotAddress);
    let coldAccount = getAccount({ accounts: state }, payload.coldAddress);

    hotAccount = {
      ...hotAccount,
      proxy: {
        ...hotAccount.proxy,
        linkedAccount: pick(['address', 'mkrBalance', 'type'], coldAccount)
      }
    };

    coldAccount = {
      ...coldAccount,
      proxy: {
        ...coldAccount.proxy,
        linkedAccount: pick(['address', 'mkrBalance', 'type'], hotAccount)
      }
    };

    return {
      ...state,
      allAccounts: withUpdatedAccount(
        withUpdatedAccount(state.allAccounts, hotAccount),
        coldAccount
      )
    };
  }
});

export default accounts;
