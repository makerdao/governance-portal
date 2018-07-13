import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

import rootReducer from "./reducers";
import { isMobile } from "./utils/misc";
import Router from "./Routes";
import Init from "./Init";
import "./global.css.js";
import { getHat } from "./chain/read";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk))
);

// window.Raven.context(() =>
//   ReactDOM.render(
//     <Provider store={store}>
//       <Init>{isMobile() ? <div>No mobile support yet</div> : <Router />}</Init>
//     </Provider>,
//     document.getElementById("root")
//   )
// );

ReactDOM.render(
  <Provider store={store}>
    <Init>{isMobile() ? <div>No mobile support yet</div> : <Router />}</Init>
  </Provider>,
  document.getElementById("root")
);
