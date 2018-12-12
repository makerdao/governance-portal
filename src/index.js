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
import { netIdToName } from './utils/ethereum';

import './global.css.js';
import theme from './theme';
import { themeDark, themeLight } from '@makerdao/ui-components';
import '@makerdao/ui-components/dist/styles/global.css';

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

const store = createStore();
if (window.web3) {
  window.web3.version.getNetwork(async (err, netId) => {
    const network = netIdToName(netId);
    const maker = (window.maker = createMaker(network));
    maker.authenticate().then(async () => store.dispatch(init(network)));
  });
} else {
  // In order to still show read-only data, we will have to re-run Maker.create with an Infura preset.
  const maker = (window.maker = createMaker());
  maker.authenticate().then(async () => store.dispatch(init()));
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
