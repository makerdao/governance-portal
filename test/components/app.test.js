import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ThemeProvider } from 'styled-components';
import pretty from 'pretty';

import Routes from '../../src/Routes';
import rootReducer from '../../src/reducers';
import theme from '../../src/theme';

import darkTheme from '@makerdao/ui-components/dist/themes/dark';
import lightTheme from '@makerdao/ui-components/dist/themes/light';

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

test('render everything', () => {
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
