import { createReducer } from '../utils/redux';
import { getHat } from '../chain/read';

// Constants ----------------------------------------------

const HAT_REQUEST = 'hat/HAT_REQUEST';
const HAT_SUCCESS = 'hat/HAT_SUCCESS';
const HAT_FAILURE = 'hat/HAT_FAILURE';

// Actions ------------------------------------------------

export const hatInit = () => dispatch => {
  dispatch({ type: HAT_REQUEST });
  getHat()
    .then(address => {
      dispatch({ type: HAT_SUCCESS, payload: { address } });
    })
    .catch(() => {
      // notify user of error or throw to fallback. Network disconnect?
      dispatch({ type: HAT_FAILURE });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  hatAddress: ''
};

const hat = createReducer(initialState, {
  [HAT_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [HAT_SUCCESS]: (_, { payload }) => ({
    hatAddress: payload.address,
    fetching: false
  }),
  [HAT_FAILURE]: () => ({
    addresses: '',
    fetching: false
  })
});

export default hat;
