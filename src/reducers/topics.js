/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import { createReducer } from "../utils/redux";
import flatten from "ramda/src/flatten";
import { initApprovalsFetch } from "./approvals";
import mocked from "../_mock/topics";

// Constants ----------------------------------------------

const TOPICS_SUCCESS = "toics/TOPICS_SUCCESS";

// Actions ------------------------------------------------

export const topicsInit = network => (dispatch, getState) => {
  const networkToShow = network === "kovan" ? "kovan" : "mainnet";
  dispatch({ type: TOPICS_SUCCESS, payload: { network: networkToShow } });
  const proposals = flatten(getState().topics.map(topic => topic.proposals));
  dispatch(initApprovalsFetch(proposals));
};

// Reducer ------------------------------------------------

const mockedBackend = mocked;

const topics = createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => mockedBackend[payload.network]
});

export default topics;
