import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { getActiveAccount, getAccount, UPDATE_ACCOUNT } from './accounts';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { voteTallyInit } from './tally';
import { initApprovalsFetch } from './approvals';
import maker from '../chain/maker';
import { ensureBrowserAccountCorrect } from './proxy';

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
  const activeAccount = getActiveAccount(getState());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');
  if (!ensureBrowserAccountCorrect(activeAccount)) return;
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });
  try {
    maker.useAccountWithAddress(activeAccount.address);
    const txHash = await maker.voteExec({
      account: activeAccount,
      proposalAddress
    });
    dispatch({ type: VOTE_SENT, payload: { txHash } });
    const txReceipt = await maker.awaitTx(txHash, { confirmations: 1 });
    console.log('mined:', txReceipt);
    dispatch({ type: VOTE_SUCCESS });

    ReactGA.event({
      category: 'Vote TX Success',
      action: 'Cast',
      label: `wallet type ${activeAccount.type || 'unknown'}`
    });

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
  const activeAccount = getActiveAccount(getState());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');
  if (!ensureBrowserAccountCorrect(activeAccount)) return;
  dispatch({ type: WITHDRAW_REQUEST });
  try {
    maker.useAccountWithAddress(activeAccount.address);
    const txHash = await maker.voteExecNone({ account: activeAccount });
    dispatch({ type: WITHDRAW_SENT, payload: { txHash } });
    const txReceipt = await maker.awaitTx(txHash, { confirmations: 1 });
    console.log('mined:', txReceipt);
    dispatch({ type: WITHDRAW_SUCCESS });

    ReactGA.event({
      category: 'Vote TX Success',
      action: 'Withdraw',
      label: `wallet type ${activeAccount.type || 'unknown'}`
    });

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
