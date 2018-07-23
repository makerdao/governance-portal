import { createReducer } from '../utils/redux';
import {
  initiateLink as _initiateLink,
  approveLink as _approveLink,
  sendMkrToProxy as _sendMkrToProxy
} from '../chain/write';
import { awaitTx } from '../chain/web3';
import { getActiveAccount } from './accounts';

// Constants ----------------------------------------------

const INITIATE_LINK_REQUEST = 'proxy/INITIATE_LINK_REQUEST';
const INITIATE_LINK_SENT = 'proxy/INITIATE_LINK_SENT';
const INITIATE_LINK_SUCCESS = 'proxy/INITIATE_LINK_SUCCESS';
const INITIATE_LINK_FAILURE = 'proxy/INITIATE_LINK_FAILURE';

const APPROVE_LINK_REQUEST = 'proxy/APPROVE_LINK_REQUEST';
const APPROVE_LINK_SENT = 'proxy/APPROVE_LINK_SENT';
const APPROVE_LINK_SUCCESS = 'proxy/APPROVE_LINK_SUCCESS';
const APPROVE_LINK_FAILURE = 'proxy/APPROVE_LINK_FAILURE';

const SEND_MKR_TO_PROXY_REQUEST = 'proxy/SEND_MKR_TO_PROXY_REQUEST';
const SEND_MKR_TO_PROXY_SENT = 'proxy/SEND_MKR_TO_PROXY_SENT';
const SEND_MKR_TO_PROXY_SUCCESS = 'proxy/SEND_MKR_TO_PROXY_SUCCESS';
const SEND_MKR_TO_PROXY_FAILURE = 'proxy/SEND_MKR_TO_PROXY_FAILURE';

const CLEAR = 'proxy/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

export const initiateLink = ({ cold, hot }) => dispatch => {
  dispatch({
    type: INITIATE_LINK_REQUEST,
    payload: { hotAddress: hot.address, coldAddress: cold.address }
  });
  _initiateLink({ coldAccount: cold, hotAddress: hot.address })
    .then(txHash => {
      dispatch({ type: INITIATE_LINK_SENT, payload: { txHash } });
      awaitTx(txHash, { confirmations: 1 })
        .then(txReceipt => {
          dispatch({ type: INITIATE_LINK_SUCCESS });
          console.log('mined', txReceipt);
        })
        .catch(() => dispatch({ type: INITIATE_LINK_FAILURE }));
    })
    .catch(() => dispatch({ type: INITIATE_LINK_FAILURE }));
};

export const approveLink = ({ hotAccount }) => (dispatch, getState) => {
  dispatch({ type: APPROVE_LINK_REQUEST });
  const { coldAddress } = getState().proxy;
  _approveLink({ hotAccount, coldAddress })
    .then(txHash => {
      dispatch({ type: APPROVE_LINK_SENT, payload: { txHash } });
      awaitTx(txHash, { confirmations: 1 })
        .then(txReceipt => {
          dispatch({ type: APPROVE_LINK_SUCCESS });
          console.log('mined', txReceipt);
        })
        .catch(() => dispatch({ type: APPROVE_LINK_FAILURE }));
    })
    .catch(() => dispatch({ type: APPROVE_LINK_FAILURE }));
};

export const sendMkrToProxy = value => (dispatch, getState) => {
  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST });
  const account = getActiveAccount(getState());
  _sendMkrToProxy({ account, value })
    .then(txHash => {
      dispatch({ type: SEND_MKR_TO_PROXY_SENT, payload: { txHash } });
      awaitTx(txHash, { confirmations: 1 })
        .then(txReceipt => {
          dispatch({ type: SEND_MKR_TO_PROXY_SUCCESS });
          console.log('mined', txReceipt);
        })
        .catch(() => dispatch({ type: SEND_MKR_TO_PROXY_FAILURE }));
    })
    .catch(() => dispatch({ type: SEND_MKR_TO_PROXY_FAILURE }));
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: '',
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  confirmingInitiate: false,
  confirmingApprove: false,
  confirmingSendMkr: false,
  hotAddress: '',
  coldAddress: ''
};

const proxy = createReducer(initialState, {
  // Initiate ---------------------------------------
  [INITIATE_LINK_REQUEST]: (state, { payload }) => ({
    ...state,
    hotAddress: payload.hotAddress,
    coldAddress: payload.coldAddress
  }),
  [INITIATE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    confirmingInitiate: true,
    initiateLinkTxHash: payload.txHash
  }),
  [INITIATE_LINK_SUCCESS]: state => ({
    ...state,
    confirmingInitiate: false
  }),
  [INITIATE_LINK_FAILURE]: state => ({
    ...state,
    confirmingInitiate: false
  }),
  // Approve ----------------------------------------
  [APPROVE_LINK_REQUEST]: state => ({
    ...state
  }),
  [APPROVE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    confirmingApprove: true,
    approveLinkTxHash: payload.txHash
  }),
  [APPROVE_LINK_SUCCESS]: state => ({
    ...state,
    confirmingApprove: false
  }),
  [APPROVE_LINK_FAILURE]: state => ({
    ...state,
    confirmingApprove: false
  }),
  // Send -------------------------------------------
  [SEND_MKR_TO_PROXY_REQUEST]: state => ({
    ...state
  }),
  [SEND_MKR_TO_PROXY_SENT]: (state, { payload }) => ({
    ...state,
    confirmingSendMkr: true,
    sendMkrTxHash: payload.txHash
  }),
  [SEND_MKR_TO_PROXY_SUCCESS]: state => ({
    ...state,
    confirmingSendMkr: false
  }),
  [SEND_MKR_TO_PROXY_FAILURE]: state => ({
    ...state,
    confirmingSendMkr: false
  }),
  // Reset ------------------------------------------
  [CLEAR]: () => ({
    ...initialState
  })
});

export default proxy;
