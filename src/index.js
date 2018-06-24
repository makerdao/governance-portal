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
import { getApprovalCount } from "./handlers/web3";
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

// getApprovalCount("0x347e94e12c623d7b9d51b3f143ff42b73d619773");
