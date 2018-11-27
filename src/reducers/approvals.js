import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { add, toNum } from '../utils/misc';

// Constants ----------------------------------------------

const APPROVALS_REQUEST = 'approvals/REQUEST';
const APPROVALS_SUCCESS = 'approvals/SUCCESS';
const APPROVALS_FAILURE = 'approvals/FAILURE';

// Actions ------------------------------------------------

export const initApprovalsFetch = () => (dispatch, getState) => {
  const proposals = getState().proposals;
  if (!proposals || proposals.length === 0)
    throw new Error('cannot get approvals before we have the topics');
  dispatch({ type: APPROVALS_REQUEST });
  Promise.all(
    proposals.map(({ source }) =>
      toNum(window.maker.service('chief').getApprovalCount(source)).then(
        approvals => ({
          [source]: approvals
        })
      )
    )
  )
    .then(approvals => {
      console.log('FETCHED APPROVALS', approvals);
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
  [APPROVALS_REQUEST]: () => ({
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
