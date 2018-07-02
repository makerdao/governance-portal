import { createReducer } from "../utils/redux";
import { getVoteTally } from "../handlers/read";

// Constants ----------------------------------------------

const TALLY_REQUEST = "voteTally/TALLY_REQUEST";
const TALLY_SUCCESS = "voteTally/TALLY_SUCCESS";
const TALLY_FAILURE = "voteTally/TALLY_FAILURE";

// Actions ------------------------------------------------

export const voteTallyInit = () => dispatch => {
  dispatch({ type: TALLY_REQUEST });
  getVoteTally()
    .then(tally => {
      dispatch({ type: TALLY_SUCCESS, payload: { tally } });
    })
    .catch(error => {
      // TODO: notify user or throw to a fallback component
      console.error(error);
      dispatch({ type: TALLY_FAILURE });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  tally: {}
};

const voteTally = createReducer(initialState, {
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

export default voteTally;
