import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import {
  getActiveAccount,
  getAccount,
  addAccounts,
  setActiveAccount
} from './accounts';
import { initApprovalsFetch } from './approvals';
import { AccountTypes } from '../utils/constants';
import { modalClose } from './modal';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { MKR } from '../chain/maker';

import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  WITHDRAW_ALL_MKR_SUCCESS,
  INITIATE_LINK_REQUEST
} from './sharedProxyConstants';

// Constants ----------------------------------------------

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

export const MKR_APPROVE_REQUEST = 'proxy/MKR_APPROVE_REQUEST';
export const MKR_APPROVE_SENT = 'proxy/MKR_APPROVE_SENT';
export const MKR_APPROVE_SUCCESS = 'proxy/MKR_APPROVE_SUCCESS';
export const MKR_APPROVE_FAILURE = 'proxy/MKR_APPROVE_FAILURE';

export const CLEAR = 'proxy/CLEAR';
export const GO_TO_STEP = 'proxy/GO_TO_STEP';

// Actions ------------------------------------------------

export const clear = () => ({ type: CLEAR });

export const goToStep = step => ({ type: GO_TO_STEP, payload: step });

const handleTx = ({
  prefix,
  dispatch,
  txObject,
  successPayload = '',
  successAction = () => {},
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
        await successAction();
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

function useCorrectAccount(requiredAccount, dispatch, options = {}) {
  const { address, type, proxyRole } = requiredAccount;

  if (
    type === AccountTypes.METAMASK &&
    window.web3.eth.defaultAccount !== address
  ) {
    const label = proxyRole || options.label || 'other';
    window.alert(`Please switch to your ${label} wallet with Metamask.`);
    return false;
  }
  if (window.maker.currentAddress().toLowerCase() !== address.toLowerCase()) {
    if (
      type === AccountTypes.METAMASK &&
      window.maker.currentAccount().type === AccountTypes.METAMASK
    ) {
      console.warn('Should have auto-switched to this account...');
    }
    window.maker.useAccountWithAddress(address);
  }

  // this is just so that we can see the change in the UI
  dispatch(setActiveAccount(address));

  return true;
}

function useColdAccount(dispatch, getState) {
  const cold = getState().accounts.allAccounts.find(
    a => a.proxyRole === 'cold'
  );
  return useCorrectAccount(cold, dispatch);
}

export const initiateLink = ({ cold, hot }) => (dispatch, getState) => {
  if (!useCorrectAccount(cold, dispatch, { label: 'cold' })) return;
  const initiateLink = window.maker
    .service('voteProxyFactory')
    .initiateLink(hot.address);

  dispatch({
    type: INITIATE_LINK_REQUEST,
    payload: { hotAddress: hot.address, coldAddress: cold.address }
  });
  return handleTx({
    prefix: 'INITIATE_LINK',
    dispatch,
    txObject: initiateLink,
    acctType: cold.type,
    successAction: () => {
      if (getAccount(getState(), getState().proxy.hotAddress)) {
        dispatch(setActiveAccount(getState().proxy.hotAddress));
      }
    }
  });
};

export const approveLink = ({ hotAccount }) => (dispatch, getState) => {
  if (!useCorrectAccount(hotAccount, dispatch, { label: 'hot' })) return;
  const { coldAddress } = getState().proxy;
  const approveLink = window.maker
    .service('voteProxyFactory')
    .approveLink(coldAddress);

  dispatch({ type: APPROVE_LINK_REQUEST });
  return handleTx({
    prefix: 'APPROVE_LINK',
    dispatch,
    txObject: approveLink,
    successPayload: { coldAddress, hotAddress: hotAccount.address },
    acctType: hotAccount.type,
    successAction: async () =>
      dispatch({
        type: STORE_PROXY_ADDRESS,
        payload: (await approveLink).proxyAddress
      })
  });
};

export const lock = value => async (dispatch, getState) => {
  if (Number(value) === 0) return dispatch(smartStepSkip());
  if (!useColdAccount(dispatch, getState)) return;
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
    acctType: account.type,
    successAction: () => dispatch(initApprovalsFetch())
  });
};

export const free = value => (dispatch, getState) => {
  if (Number(value) === 0) return dispatch(smartStepSkip());
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
    acctType: account.type,
    successAction: () => dispatch(initApprovalsFetch())
  });
};

export const freeAll = value => (dispatch, getState) => {
  if (Number(value) === 0) return dispatch(smartStepSkip());
  const account = getAccount(getState(), window.maker.currentAddress());

  const freeAll = window.maker
    .service('voteProxy')
    .freeAll(account.proxy.address);

  dispatch({ type: WITHDRAW_ALL_MKR_REQUEST, payload: value });
  return handleTx({
    prefix: 'WITHDRAW_ALL_MKR',
    dispatch,
    txObject: freeAll,
    successPayload: value,
    acctType: account.type,
    successAction: () => dispatch(initApprovalsFetch())
  });
};

export const breakLink = () => dispatch => {
  dispatch({ type: BREAK_LINK_REQUEST });
  const account = window.maker.currentAccount();
  window.maker.useAccountWithAddress(account.address);
  const breakLink = window.maker.service('voteProxyFactory').breakLink();

  return handleTx({
    prefix: 'BREAK_LINK',
    dispatch,
    txObject: breakLink,
    acctType: account.type,
    successAction: () => dispatch(refreshAccountData())
  });
};

export const smartStepSkip = () => (dispatch, getState) => {
  const { setupProgress } = getState().proxy;
  if (setupProgress === 'lockInput') return dispatch(goToStep('summary'));
  return dispatch(modalClose());
};

export const refreshAccountDataLink = () => (dispatch, getState) => {
  const hotAccount = getAccount(getState(), getState().proxy.hotAddress);
  const coldAccount = getAccount(getState(), getState().proxy.coldAddress);
  if (hotAccount === undefined) return window.location.reload();
  const accounts = coldAccount ? [hotAccount, coldAccount] : [hotAccount];
  if (coldAccount) dispatch(setActiveAccount(coldAccount.address));
  // this will replace duplicate accounts in the store
  dispatch(addAccounts(accounts));
};

export const refreshAccountData = () => (dispatch, getState) => {
  const activeAccount = getActiveAccount(getState());
  const { hasProxy, proxy } = activeAccount;
  if (hasProxy) {
    const otherAccount = getAccount(getState(), proxy.linkedAccount.address);
    const accounts = otherAccount
      ? [activeAccount, otherAccount]
      : [activeAccount];
    dispatch(addAccounts(accounts));
  } else {
    window.location.reload();
  }
};

export const mkrApproveProxy = () => (dispatch, getState) => {
  if (!useColdAccount(dispatch, getState)) return;
  const account = getAccount(getState(), window.maker.currentAddress());
  let proxyAddress = account.proxy.address;
  if (!proxyAddress) {
    //if proxy address not stored in accounts yet, then it should be in proxy store
    proxyAddress = getState().proxy.proxyAddress;
  }
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
  confirmingInitiate: false,
  confirmingApprove: false,
  confirmingSendMkr: false,
  confirmingMkrApproveProxy: false,
  setupProgress: 'intro',
  hotAddress: '',
  coldAddress: '',
  sendMkrAmount: 0,
  withdrawMkrAmount: 0,
  linkGas: 0,
  proxyAddress: ''
};

// const withExisting = { ...initialState, ...existingState };

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
  [STORE_PROXY_ADDRESS]: (state, { payload }) => ({
    ...state,
    proxyAddress: payload
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
  [MKR_APPROVE_REQUEST]: state => ({
    ...state,
    mkrApproveInitiated: true
  }),
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
    confirmingMkrApproveProxy: false,
    mkrApproveInitiated: false
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
  // WithdrawAll ---------------------------------------
  [WITHDRAW_ALL_MKR_REQUEST]: (state, { payload: value }) => ({
    ...state,
    withdrawMkrAmount: value
  }),
  [WITHDRAW_ALL_MKR_SENT]: (state, { payload }) => ({
    ...state,
    confirmingWithdrawMkr: true,
    withdrawMkrTxHash: payload.txHash
  }),
  [WITHDRAW_ALL_MKR_SUCCESS]: state => ({
    ...state,
    confirmingWithdrawMkr: false
  }),
  [WITHDRAW_ALL_MKR_FAILURE]: state => ({
    ...state,
    confirmingWithdrawMkr: false,
    withdrawMkrAmount: 0
  }),
  // Reset ------------------------------------------
  [CLEAR]: () => ({ ...initialState }),
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
    confirmingBreakLink: false
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
