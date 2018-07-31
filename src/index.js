import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import rootReducer from './reducers';
import { isMobile } from './utils/misc';
import Router from './Routes';
import './global.css.js';
import { metamaskConnectInit } from './reducers/metamask';

const localLinkProgress = store => next => action => {
  if (action.type === 'proxy/INITIATE_LINK_SUCCESS') {
    const {
      initiateLinkTxHash,
      setupProgress,
      hotAddress,
      coldAddress
    } = store.getState().proxy;
    localStorage.setItem(
      'linkInitiatedState',
      JSON.stringify({
        initiateLinkTxHash,
        setupProgress,
        hotAddress,
        coldAddress
      })
    );
  }
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    localStorage.removeItem('linkInitiated');
  }
  next(action);
};

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(ReduxThunk, localLinkProgress))
);

store.dispatch(metamaskConnectInit());

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
    {isMobile() ? <div>No mobile support yet</div> : <Router />}
  </Provider>,
  document.getElementById('root')
);
