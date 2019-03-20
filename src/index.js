import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Raven from 'raven-js';
import ReactGA from 'react-ga';
import { ThemeProvider } from 'styled-components';

import createStore from './store';
import Router from './Routes';
import createMaker from './chain/maker';
import { init, wrongNetwork } from './reducers/metamask';
import { netIdToName } from './utils/ethereum';

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

const params = new URL(window.location).searchParams;
const testchainConfigId = params.get('testchain_id');
const mcdParam = params.get('mcd');
let useMcdKovanContracts = false;
if (mcdParam === 'true') useMcdKovanContracts = true;

const store = createStore();

if (testchainConfigId) {
  const network = 'ganache';
  (async () => {
    window.maker = await createMaker(
      network,
      testchainConfigId,
      useMcdKovanContracts
    );
    await window.maker.authenticate();
    store.dispatch(init(network));
  })();
} else if (window.web3) {
  window.web3.version.getNetwork(async (err, _netId) => {
    const netId = parseInt(_netId, 10);

    if (netId !== 1 && netId !== 42) {
      store.dispatch(wrongNetwork());
    } else {
      const network = netIdToName(netId);
      const maker = (window.maker = await createMaker(network));
      await maker.authenticate();
      store.dispatch(init(network));
    }
  });
} else {
  // In order to still show read-only data, we will have to re-run Maker.create with an Infura preset.
  (async () => {
    const maker = (window.maker = await createMaker());
    await maker.authenticate();
    store.dispatch(init());
  })();
}

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
