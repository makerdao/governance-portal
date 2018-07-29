import { createReducer } from '../utils/redux';
import { voteAndLockViaProxy } from '../chain/write';
import { awaitTx } from '../chain/web3';
import { getActiveAccount, getAccount, UPDATE_ACCOUNT } from './accounts';

// Constants ----------------------------------------------

const VOTE_REQUEST = 'vote/VOTE_REQUEST';
const VOTE_SENT = 'vote/VOTE_SENT';
const VOTE_SUCCESS = 'vote/VOTE_SUCCESS';
const VOTE_FAILURE = 'vote/VOTE_FAILURE';
const CLEAR = 'vote/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

export const sendVote = proposalAddress => async (dispatch, getState) => {
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });
  const activeAccount = getActiveAccount(getState());
  if (!activeAccount || !activeAccount.hasProxy) return;
  try {
    const txHash = await voteAndLockViaProxy({
      account: activeAccount,
      proposalAddress
    });
    dispatch({ type: VOTE_SENT, payload: { txHash } });
    try {
      const txReciept = await awaitTx(txHash, { confirmations: 1 });
      console.log('mined:', txReciept);
      dispatch({ type: VOTE_SUCCESS });
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
    } catch (err) {
      // tx not mined
      dispatch({ type: VOTE_FAILURE });
    }
  } catch (err) {
    // txRejected
    dispatch({ type: VOTE_FAILURE });
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
    confirming: false
  }),
  [VOTE_FAILURE]: state => ({
    ...state,
    confirming: false,
    voteProgress: 'confirm'
  }),
  [CLEAR]: () => ({
    ...initialState
  })
});

export default vote;
