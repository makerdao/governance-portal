import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import differenceWith from 'ramda/src/differenceWith';

import { createReducer } from '../utils/redux';
import {
  getMkrBalance,
  getProxyStatus,
  getLinkedAddress,
  getVotingPower
} from '../chain/read';
import { AccountTypes } from '../utils/constants';

// Constants ----------------------------------------------

const REMOVE_ACCOUNTS = 'accounts/REMOVE_ACCOUNTS';
const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
const FETCHING_ACCOUNT_DATA = 'accounts/FETCHING_ACCOUNT_DATA';
const UPDATE_ACCOUNT = 'accounts/UPDATE_ACCOUNT';
const ADD_ACCOUNT = 'accounts/ADD_ACCOUNT';
const SET_UNLOCKED_MKR = 'accounts/SET_UNLOCKED_MKR';

// Selectors ----------------------------------------------

export function getActiveAccount(state) {
  const { activeAccount, allAccounts } = state.accounts;
  return allAccounts.find(a => a.address === activeAccount);
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
    const payload = {
      ...account,
      mkrBalance: await getMkrBalance(account.address),
      hasProxy,
      proxyRole,
      proxy: {
        address: proxyAddress,
        votingPower: hasProxy ? await getVotingPower(proxyAddress) : 0,
        mkrBalance: hasProxy ? await getMkrBalance(proxyAddress) : 0
      }
    };

    if (hasProxy) {
      const otherRole = proxyRole === 'hot' ? 'cold' : 'hot';
      const linkedAddress = await getLinkedAddress(proxyAddress, otherRole);
      payload.proxy.linkedAccount = {
        address: linkedAddress,
        proxyRole: otherRole,
        mkrBalance: await getMkrBalance(linkedAddress)
      };
    }

    await dispatch({ type: ADD_ACCOUNT, payload });
  }
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

export const accountDataInit = () => (dispatch, getState) => {
  const account = getState().accounts.activeAccount;
  // TODO if there's no active account, do something else
  const accountAddress = account.address;
  return getMkrBalance(accountAddress).then(mkr =>
    dispatch({ type: SET_UNLOCKED_MKR, payload: { mkr } })
  );
};

// Reducer ------------------------------------------------

// Reducer helpers
const uniqByAddress = uniqWith((a, b) => a.address === b.address);
const uniqConcat = pipe(
  concat,
  uniqByAddress
);
const addressCmp = (x, y) => x.address === y.address;

const initialState = {
  activeAccount: '0xbeefed1bedded2dabbed3defaced4decade5dead', // just for dev
  allAccounts: [
    {
      address: '0xbeefed1bedded2dabbed3defaced4decade5dead',
      type: 'fake',
      hasProxy: false,
      proxyRole: 'hot',
      mkrBalance: 333,
      proxy: {
        address: '0xproxyfake',
        mkrBalance: 111,
        linkedAccount: {
          address: '0xbeefed1bedded2dabbed3defaced4decade5feed',
          proxyRole: 'cold',
          mkrBalance: 222
        }
      }
    }
  ]
};

const accounts = createReducer(initialState, {
  [REMOVE_ACCOUNTS]: (state, { payload: accounts }) => ({
    ...state,
    allAccounts: differenceWith(addressCmp, state.allAccounts, accounts)
  }),
  [UPDATE_ACCOUNT]: (state, { payload: updatedAccount }) => ({
    ...state,
    allAccounts: state.allAccounts.map(
      account =>
        account.address === updatedAccount.address &&
        account.type === updatedAccount.type
          ? {
              ...account,
              ...updatedAccount
            }
          : account
    )
  }),
  [ADD_ACCOUNT]: (state, { payload: account }) => {
    if (!Object.keys(AccountTypes).includes(account.type)) {
      throw new Error(`Unrecognized account type: "${account.type}"`);
    }

    return {
      ...state,
      allAccounts: uniqConcat(state.allAccounts, [account]),
      fetching: false
    };
  },
  [SET_ACTIVE_ACCOUNT]: (state, { payload: address }) => ({
    ...initialState,
    allAccounts: state.allAccounts,
    activeAccount: address
  }),
  [SET_UNLOCKED_MKR]: (state, { payload }) => ({
    ...state,
    activeAccountUnlockedMkr: payload.mkr
  }),
  [FETCHING_ACCOUNT_DATA]: state => ({
    ...state,
    fetching: true
  })
});

export default accounts;
