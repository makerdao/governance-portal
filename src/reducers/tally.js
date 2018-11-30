import { createReducer } from '../utils/redux';
import { promiseRetry } from '../utils/misc';

// Constants ----------------------------------------------

export const TALLY_REQUEST = 'voteTally/TALLY_REQUEST';
export const TALLY_SUCCESS = 'voteTally/TALLY_SUCCESS';
export const TALLY_FAILURE = 'voteTally/TALLY_FAILURE';
export const TALLY_UPDATE = 'voteTally/TALLY_UPDATE';

// Actions ------------------------------------------------

export const voteTallyInit = () => dispatch => {
  console.log('voteTallyInit');
  const service = window.maker.service('chief');
  console.log('service', service);
  dispatch({ type: TALLY_REQUEST });
  return (
    promiseRetry({
      times: 3,
      fn: service.getVoteTally.bind(service),
      delay: 500
    })
      .then(tally => {
        console.log('tally returned by vtInit', tally);
        dispatch({ type: TALLY_SUCCESS, payload: { tally } });
      })
      // sometimes this fails when we're reading event logs
      .catch(error => {
        console.log('ERRROR');
        // TODO: notify user or throw to a fallback component
        console.error('ERROR GETTING VOTE TALLY', error);
        dispatch({ type: TALLY_FAILURE });
      })
  );
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: true,
  tally: {}
};

const tally = createReducer(initialState, {
  [TALLY_REQUEST]: _ => ({
    ...initialState,
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
