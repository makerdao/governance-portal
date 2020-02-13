import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';
import pretty from 'pretty';

import Routes from '../../src/Routes';
import rootReducer from '../../src/reducers';
import theme from '../../src/theme';

import { themeDark, themeLight } from '@makerdao/ui-components-core';

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

test.skip('render everything', () => {
  const store = createStore(rootReducer);

  const node = mount(
    <ThemeProvider theme={currTheme}>
      <Provider store={store}>
        <Routes />
      </Provider>
    </ThemeProvider>
  );

  expect(pretty(node.html())).toMatchSnapshot();
});
