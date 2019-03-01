import ReactGA from 'react-ga';

import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
import { sortBytesArray } from '../utils/ethereum';
import { getAccount, UPDATE_ACCOUNT } from './accounts';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { voteTallyInit } from './tally';
import { initApprovalsFetch } from './approvals';
import { hatInit } from './hat';

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
  proposalAddresses = []
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

        updateVotingFor(
          dispatch,
          getState,
          activeAccount,
          proposalAddresses.map(address => address.toLowerCase())
        );
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
  proposalAddresses
) => {
  // update accounts in our store w/ newly voted proposal
  const updatedActiveAcc = {
    ...activeAccount,
    votingFor: proposalAddresses
  };
  dispatch({ type: UPDATE_ACCOUNT, payload: updatedActiveAcc });
  const linkedAccount = getAccount(
    getState(),
    activeAccount.proxy.linkedAccount.address
  );
  if (!linkedAccount) return;
  const updatedLinkedAcc = {
    ...linkedAccount,
    votingFor: proposalAddresses
  };
  dispatch({ type: UPDATE_ACCOUNT, payload: updatedLinkedAcc });
};

export const sendVote = proposalAddress => (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });

  const { hat, proposals } = getState();

  const governancePollAddresses = proposals
    .filter(({ govVote }) => govVote)
    .map(({ source }) => source);

  const hatAddress = hat.address;
  const currentlyVotingForHat = activeAccount.votingFor.includes(
    hatAddress.toLowerCase()
  );
  const castingVoteInGovernancePoll = governancePollAddresses
    .map(address => address.toLowerCase())
    .includes(proposalAddress.toLowerCase());
  const castingVoteForHat =
    hatAddress.toLowerCase() === proposalAddress.toLowerCase();

  const slate = [];
  if (
    currentlyVotingForHat &&
    castingVoteInGovernancePoll &&
    !castingVoteForHat
  )
    slate.push(hatAddress);

  slate.push(proposalAddress);

  const voteExec = window.maker
    .service('voteProxy')
    .voteExec(activeAccount.proxy.address, sortBytesArray(slate));

  return handleTx({
    prefix: 'VOTE',
    dispatch,
    getState,
    txObject: voteExec,
    acctType: activeAccount.type,
    activeAccount,
    proposalAddresses: slate
  });
};

export const withdrawVote = proposalAddress => (dispatch, getState) => {
  const activeAccount = getAccount(getState(), window.maker.currentAddress());
  if (!activeAccount || !activeAccount.hasProxy)
    throw new Error('must have account active');

  dispatch({ type: WITHDRAW_REQUEST });

  const filteredSlate = activeAccount.votingFor.filter(
    address => address.toLowerCase() === proposalAddress.toLowerCase()
  );

  const voteExec = window.maker
    .service('voteProxy')
    .voteExec(activeAccount.proxy.address, sortBytesArray(filteredSlate));

  return handleTx({
    prefix: 'WITHDRAW',
    dispatch,
    getState,
    txObject: voteExec,
    acctType: activeAccount.type,
    activeAccount,
    filteredSlate
  });
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
