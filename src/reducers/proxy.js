import { createReducer } from "../utils/redux";
import { buildVoteProxy } from "../chain/send";

// Constants ----------------------------------------------

const CREATE_PROXY = "proxy/CREATE_PROXY";

// Actions ------------------------------------------------

export const createProxy = ({ cold, hot }) => dispatch => {
  buildVoteProxy({ cold, hot }).then(txHash => {
    dispatch({ type: CREATE_PROXY, payload: { txHash } });
  });
};

// Reducer ------------------------------------------------

const initialState = {
  txHash: ""
};

const proxy = createReducer(initialState, {
  [CREATE_PROXY]: (state, { payload }) => ({
    ...state,
    txHash: payload.txHash
  })
});

export default proxy;
