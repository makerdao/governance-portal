import { createReducer } from '../utils/redux';
import {
  initiateLink as _initiateLink,
  approveLink as _approveLink,
  sendMkrToProxy as _sendMkrToProxy,
  unlockWithdrawMkr as _unlockWithdrawMkr
} from '../chain/write';
import { awaitTx } from '../chain/web3';
import { getActiveAccount } from './accounts';

// Constants ----------------------------------------------

export const INITIATE_LINK_REQUEST = 'proxy/INITIATE_LINK_REQUEST';
const INITIATE_LINK_SENT = 'proxy/INITIATE_LINK_SENT';
const INITIATE_LINK_SUCCESS = 'proxy/INITIATE_LINK_SUCCESS';
const INITIATE_LINK_FAILURE = 'proxy/INITIATE_LINK_FAILURE';

const APPROVE_LINK_REQUEST = 'proxy/APPROVE_LINK_REQUEST';
const APPROVE_LINK_SENT = 'proxy/APPROVE_LINK_SENT';
export const APPROVE_LINK_SUCCESS = 'proxy/APPROVE_LINK_SUCCESS';
const APPROVE_LINK_FAILURE = 'proxy/APPROVE_LINK_FAILURE';

const SEND_MKR_TO_PROXY_REQUEST = 'proxy/SEND_MKR_TO_PROXY_REQUEST';
const SEND_MKR_TO_PROXY_SENT = 'proxy/SEND_MKR_TO_PROXY_SENT';
export const SEND_MKR_TO_PROXY_SUCCESS = 'proxy/SEND_MKR_TO_PROXY_SUCCESS';
const SEND_MKR_TO_PROXY_FAILURE = 'proxy/SEND_MKR_TO_PROXY_FAILURE';

const WITHDRAW_MKR_REQUEST = 'proxy/WITHDRAW_MKR_REQUEST';
const WITHDRAW_MKR_SENT = 'proxy/WITHDRAW_MKR_SENT';
export const WITHDRAW_MKR_SUCCESS = 'proxy/WITHDRAW_MKR_SUCCESS';
const WITHDRAW_MKR_FAILURE = 'proxy/WITHDRAW_MKR_FAILURE';

const CLEAR = 'proxy/CLEAR';
const GO_TO_STEP = 'proxy/GO_TO_STEP';

// Actions ------------------------------------------------

export const clear = () => ({ type: CLEAR });

export const goToStep = step => ({ type: GO_TO_STEP, payload: step });

// FIXME sometimes this causes an exception because of a null receipt; something
// wrong with awaitTx logic?
const handleTx = async ({ prefix, dispatch, action, successPayload = '' }) => {
  try {
    const txHash = await action;
    dispatch({ type: `proxy/${prefix}_SENT`, payload: { txHash } });
    const receipt = await awaitTx(txHash, { confirmations: 1 });
    dispatch({ type: `proxy/${prefix}_SUCCESS`, payload: successPayload });
    console.log('mined:', receipt);
  } catch (err) {
    dispatch({ type: `proxy/${prefix}_FAILURE`, payload: err });
    console.error(err);
    // TODO display this error to the user; it could require user intervention,
    // e.g. it could be due to insufficient funds
  }
};

export const initiateLink = ({ cold, hot }) => dispatch => {
  dispatch({
    type: INITIATE_LINK_REQUEST,
    payload: { hotAddress: hot.address, coldAddress: cold.address }
  });
  handleTx({
    prefix: 'INITIATE_LINK',
    dispatch,
    action: _initiateLink({ coldAccount: cold, hotAddress: hot.address })
  });
};

export const approveLink = ({ hotAccount }) => (dispatch, getState) => {
  dispatch({ type: APPROVE_LINK_REQUEST });
  const { coldAddress } = getState().proxy;
  handleTx({
    prefix: 'APPROVE_LINK',
    dispatch,
    action: _approveLink({ hotAccount, coldAddress }),
    successPayload: { coldAddress, hotAddress: hotAccount.address }
  });
};

export const sendMkrToProxy = value => (dispatch, getState) => {
  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST, payload: value });
  const account = getActiveAccount(getState());
  handleTx({
    prefix: 'SEND_MKR_TO_PROXY',
    dispatch,
    action: _sendMkrToProxy({ account, value }),
    successPayload: value
  });
};

export const withdrawMkr = value => (dispatch, getState) => {
  dispatch({ type: WITHDRAW_MKR_REQUEST });
  const account = getActiveAccount(getState());
  handleTx({
    prefix: 'WITHDRAW_MKR',
    dispatch,
    action: _unlockWithdrawMkr(account, value),
    successPayload: value
  });
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: '',
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  confirmingInitiate: false,
  confirmingApprove: false,
  confirmingSendMkr: false,
  setupProgress: 'intro',
  hotAddress: '',
  coldAddress: ''
};

const proxy = createReducer(initialState, {
  // Initiate ---------------------------------------
  [INITIATE_LINK_REQUEST]: (state, { payload }) => ({
    ...state,
    setupProgress: 'initiate',
    hotAddress: payload.hotAddress,
    coldAddress: payload.coldAddress
  }),
  [INITIATE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    confirmingInitiate: true,
    initiateLinkTxHash: payload.txHash
  }),
  [INITIATE_LINK_SUCCESS]: state => ({ ...state, confirmingInitiate: false }),
  [INITIATE_LINK_FAILURE]: (state, payload) => ({
    ...state,
    confirmingInitiate: false,
    error: payload.message
  }),
  // Approve ----------------------------------------
  [APPROVE_LINK_REQUEST]: state => ({
    ...state,
    setupProgress: 'approve'
  }),
  [APPROVE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    confirmingApprove: true,
    approveLinkTxHash: payload.txHash
  }),
  [APPROVE_LINK_SUCCESS]: state => ({
    ...state,
    confirmingApprove: false,
    setupProgress: 'lockInput'
  }),
  [APPROVE_LINK_FAILURE]: state => ({ ...state, confirmingApprove: false }),
  // Send -------------------------------------------
  [SEND_MKR_TO_PROXY_REQUEST]: (state, { payload: value }) => {
    if (state.setupProgress === 'lockInput') {
      return { ...state, setupProgress: 'lock', sendMkrAmount: value };
    }

    return { ...state, sendMkrAmount: value };
  },
  [SEND_MKR_TO_PROXY_SENT]: (state, { payload }) => ({
    ...state,
    confirmingSendMkr: true,
    sendMkrTxHash: payload.txHash
  }),
  [SEND_MKR_TO_PROXY_SUCCESS]: state => {
    if (state.setupProgress === 'lock') {
      return { ...state, setupProgress: 'summary', confirmingSendMkr: false };
    }

    return { ...state, confirmingSendMkr: false };
  },
  [SEND_MKR_TO_PROXY_FAILURE]: state => ({
    ...state,
    confirmingSendMkr: false
  }),
  // Withdraw ---------------------------------------
  [WITHDRAW_MKR_SENT]: (state, { payload }) => ({
    ...state,
    confirmingWithdrawMkr: true,
    withdrawMkrTxHash: payload.txHash
  }),
  [WITHDRAW_MKR_SUCCESS]: state => ({ ...state, confirmingWithdrawMkr: false }),
  [WITHDRAW_MKR_FAILURE]: state => ({ ...state, confirmingWithdrawMkr: false }),
  // Reset ------------------------------------------
  [CLEAR]: () => ({
    ...initialState
  }),
  [GO_TO_STEP]: (state, { payload }) => ({
    ...state,
    setupProgress: payload
  }),
  // Dev --------------------------------------------
  MOCK_NEXT_STEP: state => {
    const { setupProgress } = state;
    const step = name => ({ ...state, setupProgress: name });

    if (setupProgress === 'intro') return step('link');

    if (setupProgress === 'link') return step('initiate');

    if (setupProgress === 'initiate') {
      if (!state.initiateLinkTxHash && !state.confirmingInitiate) {
        return {
          ...state,
          confirmingInitiate: true,
          initiateLinkTxHash: '0xbeefed1bedded2dabbed3defaced4decade5cafe'
        };
      }

      if (state.confirmingInitiate)
        return { ...state, confirmingInitiate: false };

      return step('approve');
    }

    if (setupProgress === 'approve') {
      if (!state.approveLinkTxHash && !state.confirmingApprove) {
        return {
          ...state,
          confirmingApprove: true,
          approveLinkTxHash: '0xbeefed1bedded2dabbed3defaced4decade5fade'
        };
      }

      if (state.confirmingApprove)
        return { ...state, confirmingApprove: false };

      return step('lockInput');
    }

    if (setupProgress === 'lockInput') return step('lock');

    if (setupProgress === 'lock') {
      if (!state.sendMkrTxHash && !state.confirmingSendMkr) {
        return {
          ...state,
          confirmingSendMkr: true,
          sendMkrTxHash: '0xbeefed1bedded2dabbed3defaced4decade5fade'
        };
      }

      if (state.confirmingSendMkr)
        return { ...state, confirmingSendMkr: false };

      return step('summary');
    }

    if (setupProgress === 'summary') return step(null);
  }
});

export default proxy;
