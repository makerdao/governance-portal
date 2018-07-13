/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import { createReducer } from "../utils/redux";
import flatten from "ramda/src/flatten";
import { initApprovalsFetch } from "./approvals";
import mocked from "../_mock/topics";

// Constants ----------------------------------------------

const TOPICS_SUCCESS = "mock/PROPOSALS_SUCCESS";

// Actions ------------------------------------------------

export const topicsInit = network => (dispatch, getState) => {
  dispatch({ type: TOPICS_SUCCESS, payload: { network } });
  const proposals = flatten(getState().topics.map(topic => topic.proposals));
  dispatch(initApprovalsFetch(proposals));
};

// Reducer ------------------------------------------------

const mockedBackend = mocked;

const topics = createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => mockedBackend[payload.network]
});

export default topics;
