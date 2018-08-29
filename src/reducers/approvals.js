import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { getApprovalCount } from '../chain/read';
import flatten from 'ramda/src/flatten';
import { add } from '../utils/misc';

// Constants ----------------------------------------------

const APPROVALS_REQUEST = 'approvals/APPROVALS_REQUEST';
const APPROVALS_SUCCESS = 'approvals/APPROVALS_SUCCESS';
const APPROVALS_FAILURE = 'approvals/APPROVALS_FAILURE';

// Actions ------------------------------------------------

export const initApprovalsFetch = () => (dispatch, getState) => {
  const topics = getState().topics;
  if (!topics || topics.length === 0)
    throw new Error('cannot get approvals before we have the topics');
  const proposals = flatten(topics.map(topic => topic.proposals));
  dispatch({ type: APPROVALS_REQUEST });
  Promise.all(
    proposals.map(({ source }) =>
      getApprovalCount(source).then(approvals => ({
        [source]: approvals
      }))
    )
  )
    .then(approvals => {
      let total = 0;
      const approvalsObj = {};
      for (let approval of approvals) {
        const [address, amt] = Object.entries(approval)[0];
        total = add(total, amt);
        approvalsObj[address.toLowerCase()] = round(amt, 2);
      }
      total = round(total, 2);
      dispatch({ type: APPROVALS_SUCCESS, payload: { approvalsObj, total } });
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
  approvals: {},
  total: 0
};

const approvals = createReducer(initialState, {
  [APPROVALS_REQUEST]: _ => ({
    ...initialState,
    fetching: true
  }),
  [APPROVALS_SUCCESS]: (_, { payload }) => ({
    fetching: false,
    approvals: payload.approvalsObj,
    total: payload.total
  }),
  [APPROVALS_FAILURE]: state => ({
    ...state,
    fetching: false
  })
});

export default approvals;
