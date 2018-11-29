import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Raven from 'raven-js';
import ReactGA from 'react-ga';
import { ThemeProvider } from 'styled-components';

import createStore from './store';
import Router from './Routes';
import createMaker from './chain/maker';
import { init } from './reducers/metamask';

import './global.css.js';
import theme from './theme';
import { themeDark, themeLight } from '@makerdao/ui-components';
import '@makerdao/ui-components/dist/styles/global.css';

const currTheme = {
  ...theme,
  ...themeDark,
  header: {
    ...themeDark.header,
    backgroundColor: theme.text.darker_default
  },
  footer: {
    ...themeLight.footer,
    backgroundColor: theme.bg.default
  }
};

console.log('window reload, privateKey', process.env.REACT_APP_PRIVATE_KEY);
const store = createStore();
let preset, makerOptions;
// when we start we want network to be whatever MM reports, then default to mainnet
if (window.web3 && window.web3.eth.defaultAccount) {
  console.log(
    'initialize app and we have window.web3',
    window.web3.eth.defaultAccount
  );
  preset = 'browser';
} else {
  console.log('initialize app, no web3/mm');
  const network = 'mainnet';
  preset = 'http';
  makerOptions = {
    provider: {
      url: `https://${network}.infura.io/`,
      type: 'HTTP'
      // network: 'kovan',
    },
    // overrideMetamask: true
    privateKey: process.env.REACT_APP_PRIVATE_KEY
  };
}
const maker = (window.maker = createMaker(preset, makerOptions));

// TODO fail gracefully if authentication fails, e.g. if the user denies
// Metamask access or there's a network problem. in order to still show
// read-only data, we will have to re-run Maker.create with an Infura preset.
maker
  .authenticate()
  .then(async () => {
    store.dispatch(init(maker));
  })
  .catch(err => console.log('authenticate err is:', err));

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
