import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import { getAccount, UPDATE_ACCOUNT } from './accounts';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { voteTallyInit } from './tally';
import { initApprovalsFetch } from './approvals';
import { hatInit } from './hat';
import { TransactionStatus } from '../utils/constants';

// Constants ----------------------------------------------

export const VOTE_REQUEST = 'vote/VOTE_REQUEST';
export const VOTE_SENT = 'vote/VOTE_SENT';
export const VOTE_SUCCESS = 'vote/VOTE_SUCCESS';
export const VOTE_FAILURE = 'vote/VOTE_FAILURE';

export const WITHDRAW_REQUEST = 'vote/WITHDRAW_REQUEST';
export const WITHDRAW_SENT = 'vote/WITHDRAW_SENT';
export const WITHDRAW_SUCCESS = 'vote/WITHDRAW_SUCCESS';
export const WITHDRAW_FAILURE = 'vote/WITHDRAW_FAILURE';

const CLEAR = 'vote/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

const handleTx = ({
  prefix,
  dispatch,
  getState,
  txObject,
  acctType,
  activeAccount,
  proposalAddress = ''
}) =>
  new Promise(resolve => {
    const txMgr = window.maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => {
        dispatch({
          type: `vote/${prefix}_SENT`,
          payload: { txHash: tx.hash }
        });
      },
      mined: _ => {
        dispatch({ type: `vote/${prefix}_SUCCESS` });
        ReactGA.event({
          category: `${prefix} success`,
          action: prefix,
          label: `wallet type ${acctType || 'unknown'}`
        });
        // give infura time to catch up
        setTimeout(
          () => {
            dispatch(voteTallyInit());
            dispatch(hatInit());
            dispatch(initApprovalsFetch());
          },
          acctType === 'ledger' || acctType === 'trezor' ? 5000 : 2000
        ); // there is no science here

        updateVotingFor(dispatch, getState, activeAccount, proposalAddress);
        console.log('vote success', activeAccount, proposalAddress);
        resolve();
      },
      error: (_, err) => {
        dispatch({ type: `vote/${prefix}_FAILURE`, payload: err });
        dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
        ReactGA.event({
          category: 'User notification error',
          action: 'vote',
          label: parseError(err)
        });
        resolve();
      }
    });
  });

const updateVotingFor = (
  dispatch,
  getState,
  activeAccount,
  proposalAddress
) => {
  // update accounts in our store w/ newly voted proposal
  const updatedActiveAcc = {
    ...activeAccount,
    votingFor: proposalAddress
  };
  dispatch({ type: UPDATE_ACCOUNT, payload: updatedActiveAcc });
  const linkedAccount = getAccount(
    getState(),
    activeAccount.proxy.linkedAccount.address
  );
  if (!linkedAccount) return;
  const updatedLinkedAcc = {
    ...linkedAccount,
    votingFor: proposalAddress
  };
  dispatch({ type: UPDATE_ACCOUNT, payload: updatedLinkedAcc });
};

export const sendVoteDirect = proposalAddress => (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount) throw new Error('must have account active');
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });

  const voteExec = window.maker.service('chief').vote([proposalAddress]);
  const acctType = 'direct';

  return handleTx({
    prefix: 'VOTE',
    dispatch,
    getState,
    txObject: voteExec,
    acctType,
    activeAccount,
    proposalAddress
  });
};

export const sendVote = proposalAddress => (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });

  const voteExec = window.maker
    .service('voteProxy')
    .voteExec(activeAccount.proxy.address, [proposalAddress]);

  return handleTx({
    prefix: 'VOTE',
    dispatch,
    getState,
    txObject: voteExec,
    acctType: activeAccount.type,
    activeAccount,
    proposalAddress
  });
};

export const withdrawVote = () => (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');

  dispatch({ type: WITHDRAW_REQUEST });

  const voteExecNone = window.maker
    .service('voteProxy')
    .voteExec(activeAccount.proxy.address, []);

  return handleTx({
    prefix: 'WITHDRAW',
    dispatch,
    getState,
    txObject: voteExecNone,
    acctType: activeAccount.type,
    activeAccount
  });
};

// Reducer ------------------------------------------------

const initialState = {
  proposalAddress: '',
  txStatus: '',
  confirming: false,
  voteProgress: 'confirm',
  txHash: ''
};

const vote = createReducer(initialState, {
  [VOTE_REQUEST]: (state, { payload }) => ({
    ...state,
    proposalAddress: payload.address,
    txStatus: TransactionStatus.NOT_STARTED,
    txHash: ''
  }),
  [VOTE_SENT]: (state, { payload }) => ({
    ...state,
    txStatus: TransactionStatus.PENDING,
    txHash: payload.txHash
  }),
  [VOTE_SUCCESS]: state => ({
    ...state,
    proposalAddress: '',
    txStatus: TransactionStatus.MINED
  }),
  [VOTE_FAILURE]: state => ({
    ...state,
    proposalAddress: '',
    txStatus: TransactionStatus.ERROR
  }),
  [WITHDRAW_REQUEST]: state => ({
    ...state,
    txHash: '',
    txStatus: TransactionStatus.NOT_STARTED
  }),
  [WITHDRAW_SENT]: (state, { payload }) => ({
    ...state,
    txStatus: TransactionStatus.PENDING,
    txHash: payload.txHash
  }),
  [WITHDRAW_SUCCESS]: state => ({
    ...state,
    txStatus: TransactionStatus.MINED
  }),
  [WITHDRAW_FAILURE]: state => ({
    ...state,
    txStatus: TransactionStatus.ERROR
  }),
  [CLEAR]: () => ({
    ...initialState
  })
});

export default vote;
