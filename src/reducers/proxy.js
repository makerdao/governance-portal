import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import { getAccount, addAccounts, SET_ACTIVE_ACCOUNT } from './accounts';
import { AccountTypes, TransactionStatus } from '../utils/constants';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { MKR } from '../chain/maker';

import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  MKR_APPROVE_SUCCESS
} from './sharedProxyConstants';

// Constants ----------------------------------------------

export const INITIATE_LINK_REQUEST = 'proxy/INITIATE_LINK_REQUEST';
export const INITIATE_LINK_SENT = 'proxy/INITIATE_LINK_SENT';
export const INITIATE_LINK_SUCCESS = 'proxy/INITIATE_LINK_SUCCESS';
export const INITIATE_LINK_FAILURE = 'proxy/INITIATE_LINK_FAILURE';

export const APPROVE_LINK_REQUEST = 'proxy/APPROVE_LINK_REQUEST';
export const APPROVE_LINK_SENT = 'proxy/APPROVE_LINK_SENT';
export const APPROVE_LINK_SUCCESS = 'proxy/APPROVE_LINK_SUCCESS';
export const APPROVE_LINK_FAILURE = 'proxy/APPROVE_LINK_FAILURE';

export const SEND_MKR_TO_PROXY_REQUEST = 'proxy/SEND_MKR_TO_PROXY_REQUEST';
export const SEND_MKR_TO_PROXY_SENT = 'proxy/SEND_MKR_TO_PROXY_SENT';
export const SEND_MKR_TO_PROXY_FAILURE = 'proxy/SEND_MKR_TO_PROXY_FAILURE';

export const MKR_APPROVE_REQUEST = 'proxy/MKR_APPROVE_REQUEST';
export const MKR_APPROVE_STATUS_UPDATE = 'proxy/MKR_APPROVE_STATUS_UPDATE';
export const MKR_APPROVE_SENT = 'proxy/MKR_APPROVE_SENT';

export const MKR_APPROVE_FAILURE = 'proxy/MKR_APPROVE_FAILURE';

export const WITHDRAW_MKR_REQUEST = 'proxy/WITHDRAW_MKR_REQUEST';
export const WITHDRAW_MKR_SENT = 'proxy/WITHDRAW_MKR_SENT';

export const WITHDRAW_MKR_FAILURE = 'proxy/WITHDRAW_MKR_FAILURE';

export const BREAK_LINK_REQUEST = 'proxy/BREAK_LINK_REQUEST';
export const BREAK_LINK_SENT = 'proxy/BREAK_LINK_SENT';
export const BREAK_LINK_SUCCESS = 'proxy/BREAK_LINK_SUCCESS';
export const BREAK_LINK_FAILURE = 'proxy/BREAK_LINK_FAILURE';

// Actions ------------------------------------------------

const handleTx = ({
  prefix,
  dispatch,
  txObject,
  successPayload = '',
  acctType
}) =>
  new Promise(resolve => {
    const txMgr = window.maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => {
        dispatch({
          type: `proxy/${prefix}_SENT`,
          payload: { txHash: tx.hash }
        });
      },
      mined: async _ => {
        dispatch({ type: `proxy/${prefix}_SUCCESS`, payload: successPayload });
        ReactGA.event({
          category: `${prefix} success`,
          action: prefix,
          label: `wallet type ${acctType || 'unknown'}`
        });
        resolve();
      },
      error: (_, err) => {
        dispatch({ type: `proxy/${prefix}_FAILURE`, payload: err });
        dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
        ReactGA.event({
          category: 'User notification error',
          action: 'proxy',
          label: parseError(err)
        });
        resolve();
      }
    });
  });

function useHotAccount(state) {
  const account = getAccount(state, window.maker.currentAddress());

  if (
    account.type === AccountTypes.METAMASK &&
    window.web3.eth.defaultAccount !== account.address
  ) {
    window.alert(`Please switch to your hot wallet with Metamask.`);
    return false;
  }

  if (state.onboarding.hotWallet.address !== account.address) {
    if (
      account.type === AccountTypes.METAMASK &&
      window.maker.currentAccount().type === AccountTypes.METAMASK
    ) {
      console.warn('Should have auto-switched to this account...');
    }
    window.maker.useAccountWithAddress(state.onboarding.hotWallet.address);
  }

  return true;
}

function useColdAccount(state) {
  const account = getAccount(state, window.maker.currentAddress());

  if (state.onboarding.coldWallet.address !== account.address) {
    window.maker.useAccountWithAddress(state.onboarding.coldWallet.address);
  }
  return true;
}

export const initiateLink = ({ cold, hot }) => async (dispatch, getState) => {
  if (!useColdAccount(getState())) return;
  const initiateLink = window.maker
    .service('voteProxyFactory')
    .initiateLink(hot.address);

  dispatch({
    type: INITIATE_LINK_REQUEST,
    payload: {
      hotAddress: hot.address,
      coldAddress: cold.address
    }
  });

  await handleTx({
    prefix: 'INITIATE_LINK',
    dispatch,
    txObject: initiateLink,
    acctType: cold.type
  });

  return dispatch(addAccounts([hot, cold]));
};

export const approveLink = ({ hot, cold }) => async (dispatch, getState) => {
  if (!useHotAccount(getState())) return;
  const approveLink = window.maker
    .service('voteProxyFactory')
    .approveLink(cold.address);

  dispatch({ type: APPROVE_LINK_REQUEST });

  await handleTx({
    prefix: 'APPROVE_LINK',
    dispatch,
    txObject: approveLink,
    acctType: hot.type
  });

  return dispatch(addAccounts([hot, cold]));
};

export const lock = value => async (dispatch, getState) => {
  if (!useColdAccount(getState())) return;
  const account = getAccount(getState(), window.maker.currentAddress());
  const lock = window.maker
    .service('voteProxy')
    .lock(account.proxy.address, value);

  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST, payload: value });

  return handleTx({
    prefix: 'SEND_MKR_TO_PROXY',
    dispatch,
    txObject: lock,
    successPayload: value,
    acctType: account.type
  });
};

export const free = value => (dispatch, getState) => {
  const account = getAccount(getState(), window.maker.currentAddress());

  const free = window.maker
    .service('voteProxy')
    .free(account.proxy.address, value);

  dispatch({ type: WITHDRAW_MKR_REQUEST, payload: value });
  return handleTx({
    prefix: 'WITHDRAW_MKR',
    dispatch,
    txObject: free,
    successPayload: value,
    acctType: account.type
  });
};

export const breakLink = () => (dispatch, getState) => {
  dispatch({ type: BREAK_LINK_REQUEST });
  const currentAccount = window.maker.currentAccount();
  window.maker.useAccountWithAddress(currentAccount.address);
  const breakLink = window.maker.service('voteProxyFactory').breakLink();

  const account = getAccount(getState(), currentAccount.address);
  const otherAccount = getAccount(
    getState(),
    account.proxy.linkedAccount.address
  );
  const accountsToRefresh = otherAccount ? [account, otherAccount] : [account];

  return handleTx({
    prefix: 'BREAK_LINK',
    dispatch,
    txObject: breakLink,
    acctType: currentAccount.type
  }).then(() => {
    dispatch(addAccounts(accountsToRefresh));
  });
};

export const mkrApproveProxy = () => (dispatch, getState) => {
  if (!useColdAccount(getState())) return;
  const account = getAccount(getState(), window.maker.currentAddress());

  const giveProxyAllowance = window.maker
    .getToken(MKR)
    .approveUnlimited(account.proxy.address);

  dispatch({ type: MKR_APPROVE_REQUEST });
  return handleTx({
    prefix: 'MKR_APPROVE',
    dispatch,
    txObject: giveProxyAllowance,
    acctType: account.type
  });
};

// Reducer ------------------------------------------------

const initialState = {
  sendMkrTxHash: '',
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  mkrApproveProxyTxHash: '',
  withdrawMkrTxHash: '',
  breakLinkTxHash: '',
  initiateLinkTxStatus: TransactionStatus.NOT_STARTED,
  approveLinkTxStatus: TransactionStatus.NOT_STARTED,
  mkrApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
  sendMkrTxStatus: TransactionStatus.NOT_STARTED,
  withdrawMkrTxStatus: TransactionStatus.NOT_STARTED,
  breakLinkTxStatus: TransactionStatus.NOT_STARTED
};

// const withExisting = { ...initialState, ...existingState };

const proxy = createReducer(initialState, {
  // Initiate ---------------------------------------
  [INITIATE_LINK_REQUEST]: (state, { payload }) => ({
    ...state,
    initiateLinkTxHash: '',
    initiateLinkTxStatus: TransactionStatus.NOT_STARTED
  }),
  [INITIATE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    initiateLinkTxHash: payload.txHash,
    initiateLinkTxStatus: TransactionStatus.PENDING
  }),
  [INITIATE_LINK_SUCCESS]: state => ({
    ...state,
    initiateLinkTxStatus: TransactionStatus.MINED
  }),
  [INITIATE_LINK_FAILURE]: state => ({
    ...state,
    initiateLinkTxStatus: TransactionStatus.ERROR
  }),
  // Approve ----------------------------------------
  [APPROVE_LINK_REQUEST]: (state, { payload }) => ({
    ...state,
    approveLinkTxHash: '',
    approveLinkTxStatus: TransactionStatus.NOT_STARTED
  }),
  [APPROVE_LINK_SENT]: (state, { payload }) => ({
    ...state,
    approveLinkTxHash: payload.txHash,
    approveLinkTxStatus: TransactionStatus.PENDING
  }),
  [APPROVE_LINK_SUCCESS]: (state, { payload }) => ({
    ...state,
    approveLinkTxStatus: TransactionStatus.MINED,
    hotAddress: payload.hotAddress,
    coldAddress: payload.coldAddress
  }),
  [APPROVE_LINK_FAILURE]: state => ({
    ...state,
    approveLinkTxStatus: TransactionStatus.ERROR
  }),
  // Send -------------------------------------------
  [SEND_MKR_TO_PROXY_REQUEST]: state => ({
    ...state,
    sendMkrTxHash: '',
    sendMkrTxStatus: TransactionStatus.NOT_STARTED
  }),
  [SEND_MKR_TO_PROXY_SENT]: (state, { payload }) => ({
    ...state,
    sendMkrTxStatus: TransactionStatus.PENDING,
    sendMkrTxHash: payload.txHash
  }),
  [SEND_MKR_TO_PROXY_SUCCESS]: state => ({
    ...state,
    sendMkrTxStatus: TransactionStatus.MINED
  }),
  [SEND_MKR_TO_PROXY_FAILURE]: state => ({
    ...state,
    sendMkrTxStatus: TransactionStatus.ERROR
  }),
  // MKR Approve Proxy ------------------------------
  [MKR_APPROVE_REQUEST]: state => ({
    ...state,
    mkrApproveProxyTxHash: '',
    mkrApproveProxyTxStatus: TransactionStatus.NOT_STARTED
  }),
  [MKR_APPROVE_SENT]: (state, { payload }) => ({
    ...state,
    mkrApproveProxyTxStatus: TransactionStatus.PENDING,
    mkrApproveProxyTxHash: payload.txHash
  }),
  [MKR_APPROVE_SUCCESS]: state => ({
    ...state,
    mkrApproveProxyTxStatus: TransactionStatus.MINED
  }),
  [MKR_APPROVE_FAILURE]: state => ({
    ...state,
    mkrApproveProxyTxStatus: TransactionStatus.ERROR
  }),
  // Withdraw ---------------------------------------
  [WITHDRAW_MKR_REQUEST]: state => ({
    ...state,
    withdrawMkrTxHash: '',
    withdrawMkrTxStatus: TransactionStatus.NOT_STARTED
  }),
  [WITHDRAW_MKR_SENT]: (state, { payload }) => ({
    ...state,
    withdrawMkrTxStatus: TransactionStatus.PENDING,
    withdrawMkrTxHash: payload.txHash
  }),
  [WITHDRAW_MKR_SUCCESS]: state => ({
    ...state,
    withdrawMkrTxStatus: TransactionStatus.MINED
  }),
  [WITHDRAW_MKR_FAILURE]: state => ({
    ...state,
    withdrawMkrTxStatus: TransactionStatus.ERROR
  }),
  // Break Link -------------------------------------
  [BREAK_LINK_REQUEST]: state => ({
    ...state,
    breakLinkTxHash: '',
    breakLinkTxStatus: TransactionStatus.NOT_STARTED
  }),
  [BREAK_LINK_SENT]: (state, { payload }) => ({
    ...state,
    breakLinkTxStatus: TransactionStatus.PENDING,
    breakLinkTxHash: payload.txHash
  }),
  [BREAK_LINK_SUCCESS]: state => ({
    ...state,
    breakLinkTxStatus: TransactionStatus.MINED
  }),
  [BREAK_LINK_FAILURE]: state => ({
    ...state,
    breakLinkTxStatus: TransactionStatus.ERROR
  }),
  [SET_ACTIVE_ACCOUNT]: (
    state,
    { payload: { newAccount, onboardingHotAddress, onboardingColdAddress } }
  ) =>
    newAccount.address === onboardingHotAddress ||
    newAccount.address === onboardingColdAddress
      ? state
      : initialState
});

export default proxy;
