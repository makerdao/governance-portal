import { createReducer } from "../utils/redux";
import { voteProposal } from "../chain/send";
import { awaitTx } from "../chain/web3";

// Constants ----------------------------------------------

const CAST_VOTE = "transactions/CAST_VOTE";
const VOTE_SUCCESS = "transactions/VOTE_SUCCESS";
const VOTE_FAILURE = "transactions/VOTE_FAILURE";

// Actions ------------------------------------------------

export const sendVote = proposal => (dispatch, getState) => {
  dispatch({ type: CAST_VOTE, payload: { proposal } });
  // TODO: make this active account only
  const activeAccount = getState().accounts.allAccounts[0];
  if (activeAccount) {
    voteProposal({ account: activeAccount, proposal })
      .then(txHash => {
        awaitTx(txHash, { confirmations: 1 }).then(txReciept => {
          console.log("mined", txReciept);
        });
      })
      .catch(error => {
        // txRejected
        // TODO error handle
      });
  } else null; // notify no account selected
};

// Reducer ------------------------------------------------

const initialState = {
  vote: {
    proposal: "",
    txHash: ""
  }
};

const proxy = createReducer(initialState, {
  [CAST_VOTE]: (state, { payload }) => ({
    ...state,
    vote: {
      ...state.vote,
      proposal: payload.proposal
    }
  }),
  [VOTE_SUCCESS]: (state, { payload }) => ({
    ...state,
    vote: {
      ...state.vote,
      txHash: payload.txHash
    }
  }),
  [VOTE_FAILURE]: state => ({
    ...state,
    vote: {
      proposal: "",
      txHash: ""
    }
  })
});

export default proxy;
