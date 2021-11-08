import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import Raven from 'raven-js';
// import ReactGA from 'react-ga';
import { ThemeProvider } from 'styled-components';

import { mixpanelInit } from './analytics';
import createStore from './store';
import Router from './Routes';
import createMaker from './chain/maker';
import { init, wrongNetwork } from './reducers/metamask';
import { netIdToName, getUrlParam } from './utils/ethereum';

import GlobalStyle from './global.css.js';
import theme from './theme';
import { themeDark, themeLight } from '@makerdao/ui-components-core';
import '@makerdao/ui-components-core/dist/styles/global.css';

const currTheme = {
  ...theme,
  ...themeDark,
  colors: {
    ...themeDark.colors,
    // onboarding colors. to be replaced soon by presets with ui-components
    grey: '#868997',
    greys: {
      dark: '#48495F',
      light: '#E8EDEF',
      veryLight: '#F5F5F5'
    },
    red: '#E45432',
    reds: {
      light: '#FFE2D9'
    },
    green: '#30BD9F',
    greens: {
      light: '#C3F5EA'
    },
    blue: '#447AFB',
    blues: {
      light: '#EAF0FF'
    }
  },
  header: {
    ...themeDark.header,
    backgroundColor: theme.text.darker_default
  },
  footer: {
    ...themeLight.footer,
    backgroundColor: theme.bg.default
  }
};

const testchainConfigId = getUrlParam('testchain_id');
const backendEnv = getUrlParam('backendEnv');

const store = createStore();

if (testchainConfigId) {
  const network = 'ganache';
  (async () => {
    const maker = (window.maker = await createMaker(
      network,
      testchainConfigId,
      backendEnv
    ));
    await window.maker.authenticate();
    store.dispatch(init(maker, network));
  })();
} else if (window.ethereum) {
  window.ethereum.request({ method: 'eth_requestAccounts' }).then(async () => {
    const netId = parseInt(window.ethereum.networkVersion);

    if (netId !== 1 && netId !== 42) {
      store.dispatch(wrongNetwork());
    } else {
      const network = netIdToName(netId);
      const maker = (window.maker = await createMaker(network));
      await maker.authenticate();
      store.dispatch(init(maker, network));
    }
  });
} else {
  // In order to still show read-only data, we will have to re-run Maker.create with an Infura preset.
  (async () => {
    const maker = (window.maker = await createMaker());
    await maker.authenticate();
    store.dispatch(init(maker));
  })();
}

mixpanelInit();

function render() {
  ReactDOM.render(
    <ThemeProvider theme={currTheme}>
      <Provider store={store}>
        <Router />
      </Provider>
      <GlobalStyle />
    </ThemeProvider>,
    document.getElementById('root')
  );
}

// if (process.env.NODE_ENV === 'production') {
//   ReactGA.initialize('UA-65766767-7');
//   ReactGA.pageview(window.location.pathname + window.location.search);

//   Raven.config(
//     'https://424db452238242e4bd8d7e5ab064e413@sentry.io/1270414'
//   ).install();
//   Raven.context(() => render());
// } else {
render();
// }
