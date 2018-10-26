import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Raven from 'raven-js';
import ReactGA from 'react-ga';
import { ThemeProvider } from 'styled-components';

import createStore from './store';
import Router from './Routes';
import maker from './chain/maker';
import { updateAddress, init } from './reducers/metamask';
import { addAccount } from './reducers/accounts';
import { AccountTypes } from './utils/constants';

import './global.css.js';
import theme from './theme';
import darkTheme from '@makerdao/ui-components/dist/themes/dark';
import lightTheme from '@makerdao/ui-components/dist/themes/light';
import '@makerdao/ui-components/dist/styles/global.css';

const currTheme = {
  ...theme,
  ...darkTheme,
  header: {
    ...darkTheme.header,
    backgroundColor: theme.text.darker_default
  },
  footer: {
    ...lightTheme.footer,
    backgroundColor: theme.bg.default
  }
};

const store = createStore();

window.maker = maker;

// TODO fail gracefully if authentication fails, e.g. if the user denies
// Metamask access or there's a network problem. in order to still show
// read-only data, we will have to re-run Maker.create with an Infura preset.
maker.authenticate().then(async () => {
  // initialize the store with the Metamask account that the Maker instance
  // has already added
  store.dispatch(updateAddress(maker.currentAddress()));
  await store.dispatch(
    addAccount({
      address: maker.currentAddress(),
      type: AccountTypes.METAMASK
    })
  );
  store.dispatch(init(maker));
});

function render() {
  ReactDOM.render(
    <ThemeProvider theme={currTheme}>
      <Provider store={store}>
        <Router />
      </Provider>
    </ThemeProvider>,
    document.getElementById('root')
  );
}

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-65766767-7');
  ReactGA.pageview(window.location.pathname + window.location.search);

  Raven.config(
    'https://424db452238242e4bd8d7e5ab064e413@sentry.io/1270414'
  ).install();
  Raven.context(() => render());
} else {
  render();
}
