import { createReducer } from "../helpers/redux";

// -- Constants ------------------------------------------------------------- //

const UPDATE_ACCOUNT = "metamask/UPDATE_ACCOUNT";

// -- Actions --------------------------------------------------------------- //

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: account
});

// -- Reducer --------------------------------------------------------------- //

const initialState = {
  activeAddress: ""
};

const metamask = createReducer(initialState, {
  [UPDATE_ACCOUNT]: (state, { payload: { account } }) => ({
    ...state,
    account
  })
});

export default metamask;
