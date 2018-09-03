import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import {
  initiateLink as _initiateLink,
  approveLink as _approveLink,
  proxyLock as _proxyLock,
  proxyFree as _proxyFree,
  breakLink as _breakLink,
  mkrApprove as _mkrApprove
} from '../chain/write';
import { parseError } from '../utils/misc';
import { awaitTx } from '../chain/web3';
import { getLinkGas } from '../chain/read';
import {
  getActiveAccount,
  getAccount,
  addAccounts,
  setActiveAccount
} from './accounts';
import { AccountTypes } from '../utils/constants';
import { modalClose } from './modal';
import { addToastWithTimeout, ToastTypes } from './toasts';

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

const BREAK_LINK_REQUEST = 'proxy/BREAK_LINK_REQUEST';
const BREAK_LINK_SENT = 'proxy/BREAK_LINK_SENT';
export const BREAK_LINK_SUCCESS = 'proxy/BREAK_LINK_SUCCESS';
const BREAK_LINK_FAILURE = 'proxy/BREAK_LINK_FAILURE';

const MKR_APPROVE_REQUEST = 'proxy/MKR_APPROVE_REQUEST';
const MKR_APPROVE_SENT = 'proxy/MKR_APPROVE_SENT';
export const MKR_APPROVE_SUCCESS = 'proxy/MKR_APPROVE_SUCCESS';
const MKR_APPROVE_FAILURE = 'proxy/MKR_APPROVE_FAILURE';

const CLEAR = 'proxy/CLEAR';
const GO_TO_STEP = 'proxy/GO_TO_STEP';

// Selectors ----------------------------------------------

export function linkResumable(state) {
  return (
    state.proxy.setupProgress === 'midLink' ||
    ((state.proxy.setupProgress === 'initiate' ||
      state.proxy.setupProgress === 'midLink') &&
      (state.proxy.initiateLinkTxHash.length > 0 &&
        !state.proxy.confirmingInitiate))
  );
}

// Actions ------------------------------------------------

export const clear = () => ({ type: CLEAR });

export const goToStep = step => ({ type: GO_TO_STEP, payload: step });

// FIXME sometimes this causes an exception because of a null receipt; something
// wrong with awaitTx logic?
const handleTx = async ({
  prefix,
  dispatch,
  action,
  successPayload = '',
  acctType
}) => {
  try {
    const txHash = await action;
    dispatch({ type: `proxy/${prefix}_SENT`, payload: { txHash } });
    const receipt = await awaitTx(txHash, { confirmations: 1 });
    dispatch({ type: `proxy/${prefix}_SUCCESS`, payload: successPayload });
    ReactGA.event({
      category: 'Link TX Success',
      action: prefix,
      label: `wallet type ${acctType || 'unknown'}`
    });
    console.log('mined:', receipt);
  } catch (err) {
    console.error(err);
    dispatch({ type: `proxy/${prefix}_FAILURE`, payload: err });
    dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
    ReactGA.event({
      category: 'User notification error',
      action: 'proxy',
      label: parseError(err)
    });
    // TODO display this error to the user; it could require user intervention,
    // e.g. it could be due to insufficient funds
  }
};

function requireCorrectAccount(state, requiredAccount, typeNeeded) {
  if (!requiredAccount) {
    window.alert(
      `Please activate your ${typeNeeded || 'other'} wallet before continuing.`
    );
    return false;
  }
  const { address, type, proxyRole } = requiredAccount;
  if (type !== AccountTypes.METAMASK) return true;
  const activeAccount = getActiveAccount(state);
  if (activeAccount.address === address) return true;

  window.alert(
    `Please switch to your ${proxyRole || 'other'} wallet before continuing.`
  );
  return false;
}

export const initiateLink = ({ cold, hot }) => (dispatch, getState) => {
  if (!requireCorrectAccount(getState(), cold, 'cold')) return;
  const network = getState().metamask.network;
  dispatch({
    type: INITIATE_LINK_REQUEST,
    payload: { hotAddress: hot.address, coldAddress: cold.address }
  });
  handleTx({
    prefix: 'INITIATE_LINK',
    dispatch,
    action: _initiateLink({
      coldAccount: cold,
      hotAddress: hot.address,
      network
    }),
    acctType: cold.type
  });
};

export const approveLink = ({ hotAccount }) => (dispatch, getState) => {
  if (!requireCorrectAccount(getState(), hotAccount, 'hot')) return;
  const network = getState().metamask.network;
  dispatch({ type: APPROVE_LINK_REQUEST });
  const { coldAddress } = getState().proxy;
  handleTx({
    prefix: 'APPROVE_LINK',
    dispatch,
    action: _approveLink({ hotAccount, coldAddress, network }),
    successPayload: { coldAddress, hotAddress: hotAccount.address },
    acctType: hotAccount.type
  });
};

export const lock = value => (dispatch, getState) => {
  if (Number(value) === 0) return dispatch(smartStepSkip());

  const account = getActiveAccount(getState());
  if (!account || account.proxyRole !== 'cold') {
    return window.alert(`Switch to your cold wallet before continuing.`);
  }

  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST, payload: value });
  handleTx({
    prefix: 'SEND_MKR_TO_PROXY',
    dispatch,
    action: _proxyLock({ account, value }),
    successPayload: value,
    acctType: account.type
  });
};

export const free = value => (dispatch, getState) => {
  if (Number(value) === 0) return dispatch(smartStepSkip());

  const account = getActiveAccount(getState());
  dispatch({ type: WITHDRAW_MKR_REQUEST, payload: value });
  handleTx({
    prefix: 'WITHDRAW_MKR',
    dispatch,
    action: _proxyFree({ account, value }),
    successPayload: value,
    acctType: account.type
  });
};

export const breakLink = () => (dispatch, getState) => {
  dispatch({ type: BREAK_LINK_REQUEST });
  const account = getActiveAccount(getState());
  handleTx({
    prefix: 'BREAK_LINK',
    dispatch,
    action: _breakLink(account),
    acctType: account.type
  });
};

export const smartStepSkip = () => (dispatch, getState) => {
  const { setupProgress } = getState().proxy;
  if (setupProgress === 'lockInput') return dispatch(goToStep('summary'));
  return dispatch(modalClose());
};

export const postLinkUpdate = () => (dispatch, getState) => {
  const hotAccount = getAccount(getState(), getState().proxy.hotAddress);
  const coldAccount = getAccount(getState(), getState().proxy.coldAddress);
  if (hotAccount === undefined) return window.location.reload();
  const accounts = !!coldAccount ? [hotAccount, coldAccount] : [hotAccount];
  // cold account is needed for the lock, so set it active
  dispatch(setActiveAccount(coldAccount.address));
  // this will replace duplicate accounts in the store
  dispatch(addAccounts(accounts));
};

export const mkrApproveProxy = () => (dispatch, getState) => {
  const account =
    getState().proxy.coldAddress.length > 0
      ? getAccount(getState(), getState().proxy.coldAddress)
      : getActiveAccount(getState());
  if (!requireCorrectAccount(getState(), account, 'cold')) return;
  dispatch({ type: MKR_APPROVE_REQUEST });
  const proxyAddress = account.proxy.address;
  handleTx({
    prefix: 'MKR_APPROVE',
    dispatch,
    action: _mkrApprove(account, proxyAddress),
    acctType: account.type
  });
};

// Reducer ------------------------------------------------

const existingState = localStorage.getItem('linkInitiatedState')
  ? JSON.parse(localStorage.getItem('linkInitiatedState'))
  : {};

const initialState = {
  sendMkrTxHash: '',
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  mkrApproveProxyTxHash: '',
  confirmingInitiate: false,
  confirmingApprove: false,
  confirmingSendMkr: false,
  confirmingMkrApproveProxy: false,
  setupProgress: 'intro',
  hotAddress: '',
  coldAddress: '',
  sendMkrAmount: 0,
  withdrawMkrAmount: 0,
  linkGas: getLinkGas() || 0
};

const withExisting = { ...initialState, ...existingState };

const proxy = createReducer(withExisting, {
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
  [INITIATE_LINK_FAILURE]: state => ({
    ...state,
    setupProgress: 'link',
    confirmingInitiate: false
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
  [APPROVE_LINK_SUCCESS]: state => ({ ...state, confirmingApprove: false }),
  [APPROVE_LINK_FAILURE]: state => ({
    ...state,
    setupProgress: 'midLink',
    confirmingApprove: false
  }),
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
    sendMkrAmount: 0,
    confirmingSendMkr: false
  }),
  // MKR Approve Proxy ------------------------------
  [MKR_APPROVE_SENT]: (state, { payload }) => ({
    ...state,
    confirmingMkrApproveProxy: true,
    mkrApproveProxyTxHash: payload.txHash
  }),
  [MKR_APPROVE_SUCCESS]: state => ({
    ...state,
    confirmingMkrApproveProxy: false
  }),
  [MKR_APPROVE_FAILURE]: state => ({
    ...state,
    confirmingMkrApproveProxy: false
  }),
  // Withdraw ---------------------------------------
  [WITHDRAW_MKR_REQUEST]: (state, { payload: value }) => ({
    ...state,
    withdrawMkrAmount: value
  }),
  [WITHDRAW_MKR_SENT]: (state, { payload }) => ({
    ...state,
    confirmingWithdrawMkr: true,
    withdrawMkrTxHash: payload.txHash
  }),
  [WITHDRAW_MKR_SUCCESS]: state => ({
    ...state,
    confirmingWithdrawMkr: false
  }),
  [WITHDRAW_MKR_FAILURE]: state => ({
    ...state,
    confirmingWithdrawMkr: false,
    withdrawMkrAmount: 0
  }),
  // Reset ------------------------------------------
  [CLEAR]: state =>
    linkResumable({ proxy: state })
      ? {
          ...withExisting,
          ...JSON.parse(localStorage.getItem('linkInitiatedState'))
        }
      : { ...initialState },
  [GO_TO_STEP]: (state, { payload }) => ({
    ...state,
    setupProgress: payload
  }),
  // Break Link -------------------------------------
  [BREAK_LINK_REQUEST]: state => ({
    ...state,
    breakLinkInitiated: true
  }),
  [BREAK_LINK_SENT]: (state, { payload }) => ({
    ...state,
    confirmingBreakLink: true,
    breakLinkTxHash: payload.txHash
  }),
  [BREAK_LINK_SUCCESS]: state => ({
    ...state,
    confirmingBreakLink: false,
    hotAddress: '',
    coldAddress: ''
  }),
  [BREAK_LINK_FAILURE]: state => ({
    ...state,
    confirmingBreakLink: false,
    breakLinkInitiated: false
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
          initiateLinkTxHash: '0xbeefed1bedded2dabbed3defaced4decade5cafe',
          coldAddress: '0xbeefed1bedded2dabbed3defaced4decade5cafe',
          hotAddress: '0xbeefed1bedded2dabbed3defaced4decade5cafe'
        };
      }

      if (state.confirmingInitiate)
        return { ...state, confirmingInitiate: false };

      return step('midLink');
    }

    if (setupProgress === 'midLink') return step('approve');

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
