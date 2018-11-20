import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import { getAccount, UPDATE_ACCOUNT } from './accounts';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { voteTallyInit } from './tally';
import { initApprovalsFetch } from './approvals';

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

const handleTx = async ({
  prefix,
  dispatch,
  getState,
  txObject,
  acctType,
  activeAccount,
  proposalAddress = ''
}) => {
  const txMgr = window.maker.service('transactionManager');
  txMgr.listen(txObject, {
    pending: tx => {
      dispatch({
        type: `vote/${prefix}_SENT`,
        payload: { txHash: tx.hash }
      });
    },
    mined: tx => {
      dispatch({ type: `vote/${prefix}_SUCCESS` });
      ReactGA.event({
        category: `${prefix} success`,
        action: prefix,
        label: `wallet type ${acctType || 'unknown'}`
      });
      // console.log('mined:', tx);
      dispatch(voteTallyInit());
      dispatch(initApprovalsFetch());
      updateVotingFor(dispatch, getState, activeAccount, proposalAddress);
    },
    error: (tx, err) => {
      // console.error(err.message);
      dispatch({ type: `vote/${prefix}_FAILURE`, payload: err });
      dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
      ReactGA.event({
        category: 'User notification error',
        action: 'vote',
        label: parseError(err)
      });
    }
  });
};

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

export const sendVote = proposalAddress => async (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });

  const voteExec = window.maker.service('voteProxy').voteExec({
    account: activeAccount,
    proposalAddress
  });

  await handleTx({
    prefix: 'VOTE',
    dispatch,
    getState,
    txObject: voteExec,
    acctType: activeAccount.type,
    activeAccount,
    proposalAddress
  });

  /** TODO: This doesn't match exactly txManager, may need to double check this: */
  // ReactGA.event({
  //   category: 'Vote TX Success',
  //   action: 'Cast',
  //   label: `wallet type ${activeAccount.type || 'unknown'}`
  // });
};

export const withdrawVote = () => async (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');

  dispatch({ type: WITHDRAW_REQUEST });

  const voteExecNone = await window.maker.voteExecNone({
    account: activeAccount
  });

  await handleTx({
    prefix: 'WITHDRAW',
    dispatch,
    getState,
    txObject: voteExecNone,
    acctType: activeAccount.type,
    activeAccount
  });

  // TODO: double check this:
  // ReactGA.event({
  //   category: 'Vote TX Success',
  //   action: 'Withdraw',
  //   label: `wallet type ${activeAccount.type || 'unknown'}`
  // });
};

// Reducer ------------------------------------------------

const initialState = {
  proposalAddress: '',
  confirming: false,
  voteProgress: 'confirm',
  txHash: ''
};

const vote = createReducer(initialState, {
  [VOTE_REQUEST]: (state, { payload }) => ({
    ...state,
    proposalAddress: payload.address,
    voteProgress: 'signTx'
  }),
  [VOTE_SENT]: (state, { payload }) => ({
    ...state,
    confirming: true,
    txHash: payload.txHash
  }),
  [VOTE_SUCCESS]: state => ({
    ...state,
    proposalAddress: '',
    confirming: false
  }),
  [VOTE_FAILURE]: state => ({
    ...state,
    proposalAddress: '',
    confirming: false,
    voteProgress: 'confirm'
  }),
  [WITHDRAW_REQUEST]: state => ({
    ...state,
    voteProgress: 'signTx'
  }),
  [WITHDRAW_SENT]: (state, { payload }) => ({
    ...state,
    confirming: true,
    txHash: payload.txHash
  }),
  [WITHDRAW_SUCCESS]: state => ({
    ...state,
    confirming: false
  }),
  [WITHDRAW_FAILURE]: state => ({
    ...state,
    confirming: false,
    voteProgress: 'confirm'
  }),
  [CLEAR]: () => ({
    ...initialState
  })
});

export default vote;
