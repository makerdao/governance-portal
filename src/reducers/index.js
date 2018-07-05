import { combineReducers } from "redux";
import metamask from "./metamask";
import modal from "./modal";
import topics from "./topics";
import tally from "./tally";
import approvals from "./approvals";

const rootReducer = combineReducers({
  metamask,
  modal,
  topics,
  tally,
  approvals
});

export default rootReducer;
