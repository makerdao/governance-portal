import { createReducer } from '../utils/redux';
import { voteAndLockViaProxy } from '../chain/write';
import { awaitTx } from '../chain/web3';
import { getActiveAccount } from './accounts';

// Constants ----------------------------------------------

const VOTE_REQUEST = 'vote/VOTE_CAST_REQUEST';
const VOTE_SENT = 'vote/VOTE_CAST_REQUEST';
const VOTE_SUCCESS = 'vote/VOTE_SUCCESS';
const VOTE_FAILURE = 'vote/VOTE_FAILURE';
const CLEAR = 'vote/CLEAR';

// Actions ------------------------------------------------

export const clear = () => ({
  type: CLEAR
});

export const sendVote = proposalAddress => (dispatch, getState) => {
  dispatch({ type: VOTE_REQUEST, payload: { address: proposalAddress } });
  const activeAccount = getActiveAccount(getState());
  if (activeAccount && activeAccount.hasProxy) {
    voteAndLockViaProxy({ account: activeAccount, proposalAddress })
      .then(txHash => {
        dispatch({ type: VOTE_SENT, payload: { txHash } });
        awaitTx(txHash, { confirmations: 1 })
          .then(txReciept => {
            dispatch({ type: VOTE_SUCCESS });
            console.log('mined:', txReciept);
          })
          .catch(() => dispatch({ type: VOTE_FAILURE }));
      })
      .catch(() => {
        // txRejected
        // TODO error handle
        dispatch({ type: VOTE_FAILURE });
      });
  }
};

// Reducer ------------------------------------------------

const initialState = {
  proposalAddress: '',
  confirming: false,
  txHash: ''
};

const vote = createReducer(initialState, {
  [VOTE_REQUEST]: (state, { payload }) => ({
    ...state,
    proposalAddress: payload.address
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
    confirming: false
  }),
  [CLEAR]: () => ({
    ...initialState
  })
});

export default vote;
