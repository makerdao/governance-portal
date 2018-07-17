import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import append from 'ramda/src/append';
import differenceWith from 'ramda/src/differenceWith';

import { createReducer } from '../utils/redux';
import { getMkrBalance } from '../chain/read';

// Constants ----------------------------------------------

const ADD_ACCOUNTS = 'accounts/ADD_ACCOUNTS';
const REMOVE_ACCOUNTS = 'accounts/REMOVE_ACCOUNTS';
const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
const UPDATE_ACCOUNT = 'accounts/UPDATE_ACCOUNT';
const ADD_ACCOUNT = 'accounts/ADD_ACCOUNT';
const SET_UNLOCKED_MKR = 'accounts/SET_UNLOCKED_MKR';

// Selectors ----------------------------------------------

export function getActiveAccount(state) {
  const { activeAccount, allAccounts } = state.accounts;
  return allAccounts.find(a => a.address === activeAccount);
}

// Actions ------------------------------------------------

export const addAccounts = accounts => ({
  type: ADD_ACCOUNTS,
  payload: {
    accounts
  }
});

export const removeAccounts = accounts => ({
  type: REMOVE_ACCOUNTS,
  payload: {
    accounts
  }
});

export const addAccount = account => ({
  type: ADD_ACCOUNT,
  payload: {
    account
  }
});

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: {
    account
  }
});

// After the initial load, this will generally be called when an account
// is selected in the account box dropdown
export const setActiveAccount = address => {
  // get proxy info if it's not present
  // const accountInfo = getState().accounts. TODO

  return {
    type: SET_ACTIVE_ACCOUNT,
    payload: address
  };
};

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

// accounts look like { type: "METAMASK", address: "0x34a..." }
const initialState = {
  activeAccountHasProxy: false,
  activeAccountProxyType: '',
  activeAccountCurrentVote: '',
  activeAccountVotableMkr: 0,
  activeAccountUnlockedMkr: 0,
  allAccounts: [
    {
      address: '0xfakefakefake',
      type: 'fake',
      proxy: {
        address: '0xproxyfake',
        balance: 111
      },
      coldWallet: {
        address: '0xcoldfake',
        balance: 222
      }
    }
  ]
};

const accounts = createReducer(initialState, {
  [ADD_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    allAccounts: uniqConcat(state.allAccounts, payload.accounts)
  }),
  [REMOVE_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    allAccounts: differenceWith(addressCmp, state.allAccounts, payload.accounts)
  }),
  [UPDATE_ACCOUNT]: (state, { payload }) => ({
    ...state,
    allAccounts: state.allAccounts.map(
      account =>
        account.address === payload.account.address &&
        account.type === payload.account.type
          ? {
              ...account,
              ...payload.account
            }
          : account
    )
  }),
  [ADD_ACCOUNT]: (state, { payload }) => ({
    ...state,
    allAccounts: append(payload.account, state.allAccounts)
  }),
  [SET_ACTIVE_ACCOUNT]: (state, { payload: address }) => ({
    ...initialState,
    allAccounts: state.allAccounts,
    activeAccount: address
  }),
  [SET_UNLOCKED_MKR]: (state, { payload }) => ({
    ...state,
    activeAccountUnlockedMkr: payload.mkr
  })
});

export default accounts;
