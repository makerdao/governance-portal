import { createReducer } from '../utils/redux';
import { paddedBytes32ToAddress } from '../utils/ethereum';
import { toNum } from '../utils/misc';

// Constants ----------------------------------------------

const HAT_REQUEST = 'hat/HAT_REQUEST';
const HAT_SUCCESS = 'hat/HAT_SUCCESS';
const HAT_FAILURE = 'hat/HAT_FAILURE';

// Actions ------------------------------------------------

export const hatInit = () => async dispatch => {
  try {
    dispatch({ type: HAT_REQUEST });
    const bytes32 = await window.maker.service('chief').getHat();
    const address = paddedBytes32ToAddress(bytes32);
    const approvals = await toNum(
      window.maker.service('chief').getApprovalCount(address)
    );
    dispatch({ type: HAT_SUCCESS, payload: { address, approvals } });
  } catch (err) {
    dispatch({ type: HAT_FAILURE });
  }
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  hatAddress: '',
  hatApprovals: 0
};

const hat = createReducer(initialState, {
  [HAT_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [HAT_SUCCESS]: (_, { payload }) => ({
    hatAddress: payload.address,
    hatApprovals: payload.approvals,
    fetching: false
  }),
  [HAT_FAILURE]: () => ({
    ...initialState
  })
});

export default hat;
