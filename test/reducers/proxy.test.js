import maker from '../../src/chain/maker';
import { useGanache } from '../helpers/index';
import reducer, {
  initiateLink,
  INITIATE_LINK_REQUEST
} from '../../src/reducers/proxy';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const INITIATE_LINK_SUCCESS = 'proxy/INITIATE_LINK_SUCCESS';

describe('actions', () => {
  // const oldFetch = fetch;

  beforeAll(() => {
    // global.fetch = fetchMock;
    console.log('first log');
  });

  afterEach(() => {
    // fetchMock.restore();
  });

  test.skip('initateLink test', async () => {
    await useGanache();
    // need to create a real or mocked Tx mgr
    const mockAccounts = {
      cold: 'test cold account',
      hot: 'test hot account'
    };

    const store = mockStore({ acctType: 'test cold.type' });
    const expectedPayload = 'somePayload';
    const expectedActions = [
      { type: INITIATE_LINK_REQUEST },
      { type: INITIATE_LINK_SUCCESS, payload: expectedPayload }
    ];

    expect(false).toBeTrue();
    return store.dispatch(initiateLink(mockAccounts)).then(x => {
      console.log('MOCK IL', x);
    });
  });
});
