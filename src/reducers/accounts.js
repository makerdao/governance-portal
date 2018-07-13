import uniqWith from "ramda/src/uniqWith";
import concat from "ramda/src/concat";
import pipe from "ramda/src/pipe";
import reject from "ramda/src/reject";
import contains from "ramda/src/contains";
import append from "ramda/src/append";

import { createReducer } from "../utils/redux";

// Constants ----------------------------------------------

const ADD_ACCOUNTS = "accounts/ADD_ACCOUNTS";
const REMOVE_ACCOUNTS = "accounts/REMOVE_ACCOUNTS";
const SET_ACTIVE_ACCOUNT = "accounts/SET_ACTIVE_ACCOUNT";
const UPDATE_ACCOUNT = "accounts/UPDATE_ACCOUNT";
const ADD_ACCOUNT = "accounts/ADD_ACCOUNT";

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

export const setActiveAccount = account => ({
  type: SET_ACTIVE_ACCOUNT,
  payload: {
    account
  }
});

// Reducer ------------------------------------------------

// Reducer helpers
const uniqAddress = uniqWith((a, b) => a.address === b.address);
const uniqConcat = pipe(
  concat,
  uniqAddress
);
// differencewith?
const removeBySpec = (orig, toCut = []) =>
  reject(ele => contains(ele, toCut), orig);

// accounts look like {type: "MetaMask", address: "0x34a..."}
const initialState = {
  active: {},
  allAccounts: []
};

const accounts = createReducer(initialState, {
  [ADD_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    allAccounts: uniqConcat(state.allAccounts, payload.accounts)
  }),
  [REMOVE_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    allAccounts: removeBySpec(state.allAccounts, payload.accounts)
  }),
  [UPDATE_ACCOUNT]: (state, { payload }) => ({
    ...state,
    allAccounts: state.allAccounts.map(
      account =>
        account.address === payload.account.address &&
        account.type === payload.account.type
          ? { address: payload.account.address, type: account.type }
          : account
    )
  }),
  [ADD_ACCOUNT]: (state, { payload }) => ({
    ...state,
    allAccounts: append(payload.account, state.allAccounts)
  }),
  [SET_ACTIVE_ACCOUNT]: (state, { payload }) => ({
    ...state,
    active: payload.account
  })
});

export default accounts;
