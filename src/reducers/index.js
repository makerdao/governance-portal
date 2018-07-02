import { combineReducers } from "redux";
import metamask from "./metamask";
import modal from "./modal";
import mock from "./mock";
import voteTally from "./voteTally";

const rootReducer = combineReducers({
  metamask,
  modal,
  mock,
  voteTally
});

export default rootReducer;
