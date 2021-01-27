import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import {
  getAccount,
  addAccounts,
  addSingleWalletAccount,
  SET_ACTIVE_ACCOUNT
} from './accounts';
import { initApprovalsFetch } from './approvals';
import { AccountTypes, TransactionStatus, CHIEF } from '../utils/constants';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { MKR } from '../chain/maker';

import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  WITHDRAW_ALL_MKR_SUCCESS,
  MKR_APPROVE_SUCCESS,
  IOU_APPROVE_SUCCESS
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

export const STORE_PROXY_ADDRESS = 'proxy/STORE_PROXY_ADDRESS';

export const SEND_MKR_TO_PROXY_REQUEST = 'proxy/SEND_MKR_TO_PROXY_REQUEST';
export const SEND_MKR_TO_PROXY_SENT = 'proxy/SEND_MKR_TO_PROXY_SENT';
export const SEND_MKR_TO_PROXY_FAILURE = 'proxy/SEND_MKR_TO_PROXY_FAILURE';

export const MKR_APPROVE_REQUEST = 'proxy/MKR_APPROVE_REQUEST';
export const MKR_APPROVE_STATUS_UPDATE = 'proxy/MKR_APPROVE_STATUS_UPDATE';
export const MKR_APPROVE_SENT = 'proxy/MKR_APPROVE_SENT';

export const IOU_APPROVE_REQUEST = 'proxy/IOU_APPROVE_REQUEST';
export const IOU_APPROVE_STATUS_UPDATE = 'proxy/IOU_APPROVE_STATUS_UPDATE';
export const IOU_APPROVE_SENT = 'proxy/IOU_APPROVE_SENT';

export const MKR_APPROVE_FAILURE = 'proxy/MKR_APPROVE_FAILURE';
export const IOU_APPROVE_FAILURE = 'proxy/IOU_APPROVE_FAILURE';

export const WITHDRAW_MKR_REQUEST = 'proxy/WITHDRAW_MKR_REQUEST';
export const WITHDRAW_MKR_SENT = 'proxy/WITHDRAW_MKR_SENT';
export const WITHDRAW_MKR_FAILURE = 'proxy/WITHDRAW_MKR_FAILURE';

export const WITHDRAW_ALL_MKR_REQUEST = 'proxy/WITHDRAW_ALL_MKR_REQUEST';
export const WITHDRAW_ALL_MKR_SENT = 'proxy/WITHDRAW_ALL_MKR_SENT';
export const WITHDRAW_ALL_MKR_FAILURE = 'proxy/WITHDRAW_ALL_MKR_FAILURE';

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
        resolve(true);
      },
      error: (_, err) => {
        dispatch({ type: `proxy/${prefix}_FAILURE`, payload: err });
        dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
        ReactGA.event({
          category: 'User notification error',
          action: 'proxy',
          label: parseError(err)
        });
        resolve(false);
      }
    });
  });

function useHotAccount(state) {
  const account = getAccount(state, window.maker.currentAddress());

  if (
    account.type === AccountTypes.METAMASK &&
    window.ethereum.selectedAddress !== account.address
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

  if (account.singleWallet) {
    return true;
  } else if (
    state.onboarding.coldWallet &&
    state.onboarding.coldWallet.address !== account.address
  ) {
    window.maker.useAccountWithAddress(state.onboarding.coldWallet.address);
  }
  return true;
}

export const initiateLink = ({ cold, hot }) => (dispatch, getState) => {
  if (!useColdAccount(getState())) return;
  const initiateLink = window.maker
    .service('voteProxyFactory')
    .initiateLink(hot.address);

  dispatch({
    type: INITIATE_LINK_REQUEST
  });

  return handleTx({
    prefix: 'INITIATE_LINK',
    dispatch,
    txObject: initiateLink,
    acctType: cold.type
  }).then(success => success && dispatch(addAccounts([hot, cold])));
};

export const approveLink = ({ hot, cold }) => (dispatch, getState) => {
  if (!useHotAccount(getState())) return;
  const approveLink = window.maker
    .service('voteProxyFactory')
    .approveLink(cold.address);

  dispatch({ type: APPROVE_LINK_REQUEST });
  return handleTx({
    prefix: 'APPROVE_LINK',
    dispatch,
    txObject: approveLink,
    acctType: hot.type
  }).then(async success => {
    if (success) {
      dispatch({
        type: STORE_PROXY_ADDRESS,
        payload: (await approveLink).proxyAddress
      });
      dispatch(addAccounts([hot, cold]));
    }
  });
};

export const lock = value => async (dispatch, getState) => {
  if (value === 0) return;
  if (!useColdAccount(getState())) return;
  const account = getAccount(getState(), window.maker.currentAddress());

  dispatch({ type: SEND_MKR_TO_PROXY_REQUEST, payload: value });

  let lock;
  if (account.singleWallet) {
    lock = window.maker.service('chief').lock(value);
  } else {
    lock = window.maker.service('voteProxy').lock(account.proxy.address, value);
  }

  return handleTx({
    prefix: 'SEND_MKR_TO_PROXY',
    dispatch,
    txObject: lock,
    successPayload: value,
    acctType: account.type
  }).then(success => success && dispatch(initApprovalsFetch()));
};

export const free = value => (dispatch, getState) => {
  if (value <= 0) return;
  const account = getAccount(getState(), window.maker.currentAddress());

  let free;
  if (account.singleWallet) {
    free = window.maker.service('chief').free(value);
  } else {
    free = window.maker.service('voteProxy').free(account.proxy.address, value);
  }

  dispatch({ type: WITHDRAW_MKR_REQUEST, payload: value });
  return handleTx({
    prefix: 'WITHDRAW_MKR',
    dispatch,
    txObject: free,
    successPayload: value,
    acctType: account.type
  }).then(success => success && dispatch(initApprovalsFetch()));
};
export const freeAll = value => (dispatch, getState) => {
  if (value <= 0) return;
  const account = getAccount(getState(), window.maker.currentAddress());

  let freeAll;
  if (account.singleWallet) {
    freeAll = window.maker.service('chief').free(value);
  } else {
    freeAll = window.maker.service('voteProxy').freeAll(account.proxy.address);
  }

  dispatch({ type: WITHDRAW_ALL_MKR_REQUEST, payload: value });
  return handleTx({
    prefix: 'WITHDRAW_ALL_MKR',
    dispatch,
    txObject: freeAll,
    successPayload: value,
    acctType: account.type
  }).then(success => success && dispatch(initApprovalsFetch()));
};

export const breakLink = () => (dispatch, getState) => {
  dispatch({ type: BREAK_LINK_REQUEST });
  const currentAccount = window.maker.currentAccount();
  const account = getAccount(getState(), currentAccount.address);

  const otherAccount = getAccount(
    getState(),
    account.proxy.linkedAccount.address
  );
  const accountsToRefresh = otherAccount ? [account, otherAccount] : [account];

  window.maker.useAccountWithAddress(currentAccount.address);
  const breakLink = window.maker.service('voteProxyFactory').breakLink();

  return handleTx({
    prefix: 'BREAK_LINK',
    dispatch,
    txObject: breakLink,
    acctType: currentAccount.type
  }).then(success => {
    success && dispatch(addAccounts(accountsToRefresh));
  });
};

export const mkrApproveSingleWallet = () => (dispatch, getState) => {
  const account = getAccount(getState(), window.maker.currentAddress());

  const chiefAddress = window.maker
    .service('smartContract')
    .getContractAddressByName(CHIEF);

  const giveChiefAllowance = window.maker
    .getToken(MKR)
    .approveUnlimited(chiefAddress);

  dispatch({ type: MKR_APPROVE_REQUEST });
  return handleTx({
    prefix: 'MKR_APPROVE',
    dispatch,
    txObject: giveChiefAllowance,
    acctType: account.type,
    successPayload: 'single-wallet'
  }).then(success => success && dispatch(addSingleWalletAccount(account)));
};

export const iouApproveSingleWallet = () => (dispatch, getState) => {
  const account = getAccount(getState(), window.maker.currentAddress());

  const chiefAddress = window.maker
    .service('smartContract')
    .getContractAddressByName(CHIEF);

  const giveChiefAllowance = window.maker
    .getToken('IOU')
    .approveUnlimited(chiefAddress);

  dispatch({ type: IOU_APPROVE_REQUEST });
  return handleTx({
    prefix: 'IOU_APPROVE',
    dispatch,
    txObject: giveChiefAllowance,
    acctType: account.type
  }).then(success => success && dispatch(addSingleWalletAccount(account)));
};

export const mkrApproveProxy = () => (dispatch, getState) => {
  if (!useColdAccount(getState())) return;
  const account = getAccount(getState(), window.maker.currentAddress());
  let proxyAddress = account.proxy.address;
  if (!proxyAddress) {
    //if proxy address not stored in accounts yet, then it should be in proxy store
    proxyAddress = getState().proxy.proxyAddress;
  }
  const giveProxyAllowance = window.maker
    .getToken(MKR)
    .approveUnlimited(proxyAddress);

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
  iouApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
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
  [STORE_PROXY_ADDRESS]: (state, { payload }) => ({
    ...state,
    proxyAddress: payload
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
  // IOU Approve Chief ------------------------------
  [IOU_APPROVE_REQUEST]: state => ({
    ...state,
    iouApproveProxyTxHash: '',
    iouApproveProxyTxStatus: TransactionStatus.NOT_STARTED
  }),
  [IOU_APPROVE_SENT]: (state, { payload }) => ({
    ...state,
    iouApproveProxyTxStatus: TransactionStatus.PENDING,
    iouApproveProxyTxHash: payload.txHash
  }),
  [IOU_APPROVE_SUCCESS]: state => ({
    ...state,
    iouApproveProxyTxStatus: TransactionStatus.MINED
  }),
  [IOU_APPROVE_FAILURE]: state => ({
    ...state,
    iouApproveProxyTxStatus: TransactionStatus.ERROR
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
  // Withdraw All ---------------------------------------
  [WITHDRAW_ALL_MKR_REQUEST]: state => ({
    ...state,
    withdrawMkrTxHash: '',
    withdrawMkrTxStatus: TransactionStatus.NOT_STARTED
  }),
  [WITHDRAW_ALL_MKR_SENT]: (state, { payload }) => ({
    ...state,
    withdrawMkrTxStatus: TransactionStatus.PENDING,
    withdrawMkrTxHash: payload.txHash
  }),
  [WITHDRAW_ALL_MKR_SUCCESS]: state => ({
    ...state,
    withdrawMkrTxStatus: TransactionStatus.MINED
  }),
  [WITHDRAW_ALL_MKR_FAILURE]: state => ({
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
