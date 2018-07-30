import { createReducer } from '../utils/redux';
import { voteAndLockViaProxy, freeAll } from '../chain/write';
import { awaitTx } from '../chain/web3';
import { getActiveAccount, getAccount, UPDATE_ACCOUNT } from './accounts';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { voteTallyInit } from './tally';
import { initApprovalsFetch } from './approvals';

// Constants ----------------------------------------------

const VOTE_REQUEST = 'vote/VOTE_REQUEST';
const VOTE_SENT = 'vote/VOTE_SENT';
const VOTE_SUCCESS = 'vote/VOTE_SUCCESS';
const VOTE_FAILURE = 'vote/VOTE_FAILURE';

const WITHDRAW_REQUEST = 'vote/WITHDRAW_REQUEST';
const WITHDRAW_SENT = 'vote/WITHDRAW_SENT';
const WITHDRAW_SUCCESS = 'vote/WITHDRAW_SUCCESS';
const WITHDRAW_FAILURE = 'vote/WITHDRAW_FAILURE';

const CLEAR = 'vote/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
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

export const sendVote = proposalAddress => async (dispatch, getState) => {
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });
  const activeAccount = getActiveAccount(getState());
  try {
    if (!activeAccount || !activeAccount.hasProxy)
      throw new Error('must have account active');
    const txHash = await voteAndLockViaProxy({
      account: activeAccount,
      proposalAddress
    });
    dispatch({ type: VOTE_SENT, payload: { txHash } });
    const txReciept = await awaitTx(txHash, { confirmations: 1 });
    console.log('mined:', txReciept);
    dispatch({ type: VOTE_SUCCESS });

    // update vote tally and approval nums
    dispatch(voteTallyInit());
    dispatch(initApprovalsFetch());

    updateVotingFor(dispatch, getState, activeAccount, proposalAddress);
  } catch (err) {
    dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
    dispatch({ type: VOTE_FAILURE });
  }
};

export const withdrawVote = () => async (dispatch, getState) => {
  dispatch({ type: WITHDRAW_REQUEST });
  const activeAccount = getActiveAccount(getState());
  try {
    if (!activeAccount || !activeAccount.hasProxy)
      throw new Error('must have account active');
    const txHash = await freeAll(activeAccount);
    dispatch({ type: WITHDRAW_SENT, payload: { txHash } });
    const txReciept = await awaitTx(txHash, { confirmations: 1 });
    console.log('mined:', txReciept);
    dispatch({ type: WITHDRAW_SUCCESS });

    // update vote tally and approval nums
    dispatch(voteTallyInit());
    dispatch(initApprovalsFetch());

    updateVotingFor(dispatch, getState, activeAccount, '');
  } catch (err) {
    dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
    dispatch({ type: WITHDRAW_FAILURE });
  }
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
