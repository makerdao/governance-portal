import { createReducer } from '../utils/redux';
import { getApprovalCount } from '../chain/read';

// Constants ----------------------------------------------

const APPROVALS_REQUEST = 'voteTally/APPROVALS_REQUEST';
const APPROVALS_SUCCESS = 'voteTally/APPROVALS_SUCCESS';
const APPROVALS_FAILURE = 'voteTally/APPROVALS_FAILURE';

// Actions ------------------------------------------------

export const initApprovalsFetch = proposals => dispatch => {
  dispatch({ type: APPROVALS_REQUEST });
  Promise.all(
    proposals.map(({ source }) =>
      getApprovalCount(source).then(approvals => ({
        [source]: approvals
      }))
    )
  )
    .then(approvals => {
      const approvalsObj = {};
      for (let approval of approvals) {
        const [address, amt] = Object.entries(approval)[0];
        approvalsObj[address] = parseFloat(amt).toFixed(2);
      }
      dispatch({ type: APPROVALS_SUCCESS, payload: { approvalsObj } });
    })
    .catch(error => {
      // TODO: notify user or throw to a fallback component
      console.error(error);
      dispatch({ type: APPROVALS_FAILURE });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: true,
  approvals: {}
};

const approvals = createReducer(initialState, {
  [APPROVALS_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [APPROVALS_SUCCESS]: (_, { payload }) => ({
    fetching: false,
    approvals: payload.approvalsObj
  }),
  [APPROVALS_FAILURE]: state => ({
    ...state,
    fetching: false
  })
});

export default approvals;
