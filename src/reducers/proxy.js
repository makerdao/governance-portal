import { createReducer } from "../utils/redux";
import {
  initateLink as _initateLink,
  sendMkrToProxy as _sendMkrToProxy
} from "../chain/send";

// Constants ----------------------------------------------

const CREATE_PROXY = "proxy/CREATE_PROXY";
const SEND_MKR_TO_PROXY = "proxy/SEND_MKR_TO_PROXY";

// Actions ------------------------------------------------

export const initiateLink = ({ coldAccount, hotAddress }) => dispatch => {
  _initateLink({ coldAccount, hotAddress }).then(txHash => {
    dispatch({ type: CREATE_PROXY, payload: { txHash } });
  });
};

export const sendMkrToProxy = value => (dispatch, getState) => {
  const account = getState().accounts.activeAccount;
  _sendMkrToProxy({ account, value }).then(txHash => {
    dispatch({ type: SEND_MKR_TO_PROXY, payload: { txHash } });
  });
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: "",
  createProxyTxHash: ""
};

const proxy = createReducer(initialState, {
  [CREATE_PROXY]: (state, { payload }) => ({
    ...state,
    createProxyTxHash: payload.txHash
  }),
  [SEND_MKR_TO_PROXY]: (state, { payload }) => ({
    ...state,
    sendMkrTxHash: payload.txHash
  })
});

export default proxy;
