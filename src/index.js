import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { injectGlobal } from "styled-components";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import rootReducer from "./reducers";
import { globalStyles } from "./styles";
import Router from "./Router";
import {
  getSlateAddresses,
  getVotedSlate,
  getApprovalCount,
  getNumDeposits
} from "./handlers/web3";
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

injectGlobal`${globalStyles}`;

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById("root")
);

// getVotedSlate("0xee10f133B91E3e700e6f254b446CCAC6fD287EDA");

// getApprovalCount("0x347e94e12c623d7b9d51b3f143ff42b73d619773");

// getSlateAddresses(
//   "0x477b9eb514c9c9a4eaff864b3590bce280c2464d3b7e153d8d6e3a720d16788a"
// );

// getNumDeposits("0x12958035f5d05d4e8acda1264cca55937a4afae8");

// current hat address mainnet: 0x347e94e12c623d7b9d51b3f143ff42b73d619773
// slate: 0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563
// address 1 that has voted: 0xee10f133B91E3e700e6f254b446CCAC6fD287EDA

// address 2 that has voted: 0x12958035f5d05d4e8acda1264cca55937a4afae8 (w/ current deposits)
