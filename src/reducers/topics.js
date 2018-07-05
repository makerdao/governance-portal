/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import { createReducer } from "../utils/redux";
import flatten from "ramda/src/flatten";
import { initApprovalsFetch } from "./approvals";
import mocked from "../_mock/topics";

// Constants ----------------------------------------------

// const PROPOSALS_REQUEST = "mock/PROPOSALS_REQUEST";
const PROPOSALS_SUCCESS = "mock/PROPOSALS_SUCCESS";
// const PROPOSALS_FAILURE = "mock/PROPOSALS_FAILURE";

// Actions ------------------------------------------------

export const topicsFetchInit = () => (dispatch, getState) => {
  dispatch({ type: PROPOSALS_SUCCESS });
  const proposals = flatten(getState().topics.map(topic => topic.proposals));
  dispatch(initApprovalsFetch(proposals));
};

// Reducer ------------------------------------------------

// date: "2018-04-20",, slug, description
// "dates": {
//   "start": "2017-10-02",
//   "end": "2017-10-03"
// }

const mockedBackend = mocked;

const topics = createReducer(mockedBackend, {});

export default topics;
