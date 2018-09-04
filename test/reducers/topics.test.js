import { topicsInit } from '../../src/reducers/topics';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

test('topicsInit returns a TOPICS_SUCCESS action with topics as a payload', async () => {
  const store = mockStore({});
  store.dispatch(topicsInit('mainnet'));
  expect(store.getActions()).toMatchSnapshot();
});
