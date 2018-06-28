import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { injectGlobal } from "styled-components";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import rootReducer from "./reducers";
import { globalStyles } from "./styles";
import { isMobile } from "./utils/misc";
import Router from "./Routes";
import Init from "./Init";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

injectGlobal`${globalStyles}`;

ReactDOM.render(
  <Provider store={store}>
    <Init>{isMobile() ? <div>No mobile support yet</div> : <Router />}</Init>
  </Provider>,
  document.getElementById("root")
);
