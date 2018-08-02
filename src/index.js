import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from './reducers';
import { isMobile } from './utils/misc';
import Router from './Routes';
import { localLinkProgress } from './middlewares';
import './global.css.js';
import { metamaskConnectInit } from './reducers/metamask';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, localLinkProgress))
);

store.dispatch(metamaskConnectInit());

if (process.env.NODE_ENV === 'production') {
  window.Raven.context(() =>
    ReactDOM.render(
      <Provider store={store}>
        {isMobile() ? <div>No mobile support yet</div> : <Router />}
      </Provider>,
      document.getElementById('root')
    )
  );
} else {
  ReactDOM.render(
    <Provider store={store}>
      {isMobile() ? <div>No mobile support yet</div> : <Router />}
    </Provider>,
    document.getElementById('root')
  );
}
