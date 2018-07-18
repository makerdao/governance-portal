import { createReducer } from '../utils/redux';
import { getVoteTally } from '../chain/read';
import { promiseRetry } from '../utils/misc';

// Constants ----------------------------------------------

const TALLY_REQUEST = 'voteTally/TALLY_REQUEST';
const TALLY_SUCCESS = 'voteTally/TALLY_SUCCESS';
const TALLY_FAILURE = 'voteTally/TALLY_FAILURE';

// Actions ------------------------------------------------

export const voteTallyInit = () => dispatch => {
  dispatch({ type: TALLY_REQUEST });
  // NOTE: sometimes the following call will lose its reference of "getVoteTally" on hot reloads
  promiseRetry({ times: 3, fn: getVoteTally, delay: 500 })
    .then(tally => {
      dispatch({ type: TALLY_SUCCESS, payload: { tally } });
    })
    // sometimes this fails when we're reading event logs
    .catch(error => {
      // TODO: notify user or throw to a fallback component
      console.error(error);
      dispatch({ type: TALLY_FAILURE });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: true,
  tally: {}
};

const tally = createReducer(initialState, {
  [TALLY_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [TALLY_SUCCESS]: (_, { payload }) => ({
    fetching: false,
    tally: payload.tally
  }),
  [TALLY_FAILURE]: state => ({
    ...state,
    fetching: false
  })
});

export default tally;
