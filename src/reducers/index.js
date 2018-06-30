import { combineReducers } from "redux";
import metamask from "./metamask";
import modal from "./modal";

const rootReducer = combineReducers({
  metamask,
  modal
});

export default rootReducer;
