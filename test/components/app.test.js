import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Routes from '../../src/Routes';
import rootReducer from '../../src/reducers';

test('render everything', () => {
  const store = createStore(rootReducer);

  const node = mount(
    <Provider store={store}>
      <Routes />
    </Provider>
  );

  expect(node.html()).toMatchSnapshot();
});
