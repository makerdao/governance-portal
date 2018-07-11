import { combineReducers } from "redux";
import metamask from "./metamask";
import modal from "./modal";
import topics from "./topics";
import tally from "./tally";
import approvals from "./approvals";
import proxy from "./proxy";
import user from "./user";
import accounts from "./accounts";

const rootReducer = combineReducers({
  metamask,
  modal,
  topics,
  tally,
  approvals,
  proxy,
  user,
  accounts
});

export default rootReducer;
