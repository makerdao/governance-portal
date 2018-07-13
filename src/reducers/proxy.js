import { createReducer } from "../utils/redux";
import {
  initateLink as _initateLink,
  sendMkrToProxy as _sendMkrToProxy
} from "../chain/write";

// Constants ----------------------------------------------

const INITIATE_LINK_REQUEST = "proxy/INITIATE_LINK_REQUEST";
const INITIATE_LINK_SENT = "proxy/INITIATE_LINK_SENT";
// const INITIATE_LINK_SUCCESS = "proxy/INITIATE_LINK_SUCCESS";
const SEND_MKR_TO_PROXY_REQUEST = "proxy/SEND_MKR_TO_PROXY_REQUEST";
const SEND_MKR_TO_PROXY_SENT = "proxy/SEND_MKR_TO_PROXY_SENT";
const CLEAR = "proxy/CLEAR";

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

export const initiateLink = ({ coldAccount, hotAddress }) => dispatch => {
  dispatch({ type: INITIATE_LINK_REQUEST });
  _initateLink({ coldAccount, hotAddress }).then(txHash => {
    dispatch({ type: INITIATE_LINK_SENT, payload: { txHash } });
  });
};

export const sendMkrToProxy = value => (dispatch, getState) => {
  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST });
  const account = getState().accounts.activeAccount;
  _sendMkrToProxy({ account, value }).then(txHash => {
    dispatch({ type: SEND_MKR_TO_PROXY_SENT, payload: { txHash } });
  });
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: "",
  initateLinkTxHash: ""
};

const proxy = createReducer(initialState, {
  [INITIATE_LINK_REQUEST]: state => ({
    ...state
  }),
  [INITIATE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    initateLinkTxHash: payload.txHash
  }),
  [SEND_MKR_TO_PROXY_REQUEST]: state => ({
    ...state
  }),
  [SEND_MKR_TO_PROXY_SENT]: (state, { payload }) => ({
    ...state,
    sendMkrTxHash: payload.txHash
  }),
  [CLEAR]: () => ({
    ...initialState
  })
});

export default proxy;
