import { createReducer } from '../utils/redux';
import {
  initiateLink as _initiateLink,
  approveLink as _approveLink,
  sendMkrToProxy as _sendMkrToProxy
} from '../chain/write';
import { getActiveAccount } from './accounts';

// Constants ----------------------------------------------

const INITIATE_LINK_REQUEST = 'proxy/INITIATE_LINK_REQUEST';
const INITIATE_LINK_SENT = 'proxy/INITIATE_LINK_SENT';
const APPROVE_LINK_REQUEST = 'proxy/APPROVE_LINK_REQUEST';
const APPROVE_LINK_SENT = 'proxy/APPROVE_LINK_SENT';
// const INITIATE_LINK_SUCCESS = "proxy/INITIATE_LINK_SUCCESS";
const SEND_MKR_TO_PROXY_REQUEST = 'proxy/SEND_MKR_TO_PROXY_REQUEST';
const SEND_MKR_TO_PROXY_SENT = 'proxy/SEND_MKR_TO_PROXY_SENT';
const CLEAR = 'proxy/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

export const initiateLink = ({ cold, hot }) => dispatch => {
  dispatch({ type: INITIATE_LINK_REQUEST, payload: { hot, cold } });
  _initiateLink({ coldAccount: cold, hotAddress: hot.address }).then(txHash => {
    dispatch({ type: INITIATE_LINK_SENT, payload: { txHash } });
  });
};

export const approveLink = ({ hotAccount }) => (dispatch, getState) => {
  dispatch({ type: APPROVE_LINK_REQUEST });
  const coldAddress = getState().proxy.cold.address;
  _approveLink({ hotAccount, coldAddress }).then(txHash => {
    dispatch({ type: APPROVE_LINK_SENT, payload: { txHash } });
  });
};

export const sendMkrToProxy = value => (dispatch, getState) => {
  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST });
  const account = getActiveAccount(getState());
  _sendMkrToProxy({ account, value }).then(txHash => {
    dispatch({ type: SEND_MKR_TO_PROXY_SENT, payload: { txHash } });
  });
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: '',
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  hot: '',
  cold: ''
};

const proxy = createReducer(initialState, {
  [INITIATE_LINK_REQUEST]: (state, { payload }) => ({
    ...state,
    hot: payload.hot,
    cold: payload.cold
  }),
  [INITIATE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    initiateLinkTxHash: payload.txHash
  }),
  [APPROVE_LINK_REQUEST]: state => ({
    ...state
  }),
  [APPROVE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    approveLinkTxHash: payload.txHash
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
