import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import Raven from 'raven-js';
import ReactGA from 'react-ga';
import { ThemeProvider } from 'styled-components';

import rootReducer from './reducers';
import { isMobile } from './utils/misc';
import Router from './Routes';
import {
  localLinkProgress,
  updateAccountsAfterLink,
  failureLogging
} from './middlewares';
import './global.css.js';
import { metamaskConnectInit } from './reducers/metamask';
import theme from './theme';

import darkTheme from '@makerdao/ui-components/dist/themes/dark';
import '@makerdao/ui-components/dist/styles/global.css';

const currTheme = {
  ...theme,
  ...darkTheme,
  header: {
    ...darkTheme.header,
    backgroundColor: theme.text.darker_default
  },
  footer: {
    ...darkTheme.footer,
    backgroundColor: theme.text.darker_default
  }
};

const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(
      ReduxThunk,
      localLinkProgress,
      updateAccountsAfterLink,
      failureLogging
    )
  )
);

store.dispatch(metamaskConnectInit());

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-123682690-1');
  ReactGA.pageview(window.location.pathname + window.location.search);
}

if (process.env.NODE_ENV === 'production') {
  Raven.config(
    'https://3113186e2c5b4ef8b8eef1095b08a42b@sentry.io/1241257'
  ).install();
  Raven.context(() =>
    ReactDOM.render(
      <ThemeProvider theme={currTheme}>
        <Provider store={store}>
          {isMobile() ? <div>No mobile support yet</div> : <Router />}
        </Provider>
      </ThemeProvider>,
      document.getElementById('root')
    )
  );
} else {
  ReactDOM.render(
    <ThemeProvider theme={currTheme}>
      <Provider store={store}>
        {isMobile() ? <div>No mobile support yet</div> : <Router />}
      </Provider>
    </ThemeProvider>,
    document.getElementById('root')
  );
}

// in case user's local storage has been set by a previous iteration of
// localLinkProgress middleware
if (
  localStorage.getItem('linkInitiatedState') &&
  JSON.parse(localStorage.getItem('linkInitiatedState')).setupProgress ===
    'initiate'
) {
  localStorage.clear();
  window.location.reload();
}
