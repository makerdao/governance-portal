import uniqWith from "ramda/src/uniqWith";
import concat from "ramda/src/concat";
import pipe from "ramda/src/pipe";
import reject from "ramda/src/reject";
import contains from "ramda/src/contains";

import { createReducer } from "../utils/redux";

// Constants ----------------------------------------------

const ADD_ACCOUNTS = "accounts/ADD_ACCOUNTS";
const REMOVE_ACCOUNTS = "accounts/REMOVE_ACCOUNTS";
const SET_ACTIVE_ACCOUNT = "accounts/SET_ACTIVE_ACCOUNT";

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
const removeBySpec = (orig, toCut = []) =>
  reject(ele => contains(ele, toCut), orig);

// account objects look like: {type: "", address: ""}
const initialState = {
  active: {},
  accounts: []
};

const accounts = createReducer(initialState, {
  [ADD_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    accounts: uniqConcat(state.accounts, payload.accounts)
  }),
  [REMOVE_ACCOUNTS]: (state, { payload }) => ({
    ...state,
    accounts: removeBySpec(state.accounts, payload.accounts)
  }),
  [SET_ACTIVE_ACCOUNT]: (state, { payload }) => ({
    ...state,
    active: payload.account
  })
});

export default accounts;
