import * as reducer from '../../src/reducers/tally';
import * as utils from '../../src/utils/misc';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

// Mock state setup
const initialState = {};

// Mock service methods
const getVoteTally = jest.fn();
const mockService = name => {
  if (name === 'chief') return { getVoteTally };
};

const defaultFunctions = {
  service: jest.fn(mockService)
};

describe('Tally Reducer', () => {
  beforeAll(() => {
    const mockProvider = {
      sendAsync: ({ method }, callback) => {
        if (method === 'eth_accounts') {
          callback(null, { result: ['0xf00'] });
        }
      }
    };
    window.web3 = {
      currentProvider: mockProvider,
      eth: {
        defaultAccount: '0xf00bae'
      }
    };
    window.ethereum = {
      enable: async () => {
        window.ethereum['sendAsync'] = mockProvider.sendAsync;
      }
    };
    window.maker = defaultFunctions;
  });

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterAll(() => {
    Object.assign(window, origWindow);
    delete window.web3;
    delete window.ethereum;
  });

  describe('voteTallyInit', () => {
    const fakeTally = {
      '0x26EC003c72ebA27749083d588cdF7EBA665c0A1D': [
        {
          address: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6',
          deposits: 3,
          percent: '100.00'
        }
      ],
      '0x54F4E468FB0297F55D8DfE57336D186009A1455a': [
        {
          address: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6',
          deposits: 3,
          percent: '100.00'
        }
      ]
    };

    test('voteTallyInit should dispatch SUCCESS action with tally payload.', async () => {
      const promiseRetry = jest.fn(() => Promise.resolve(fakeTally));
      utils.promiseRetry = promiseRetry;

      await reducer.voteTallyInit()(store.dispatch);

      expect(promiseRetry).toBeCalledTimes(1);
      expect(promiseRetry).toBeCalledWith(
        expect.objectContaining({
          times: expect.any(Number),
          delay: expect.any(Number),
          fn: expect.any(Function)
        })
      );
      expect(store.getActions().length).toBe(2);
      expect(store.getActions()[0]).toEqual({
        type: reducer.TALLY_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.TALLY_SUCCESS,
        payload: {
          tally: fakeTally
        }
      });
    });

    test('voteTallyInit should dispatch FAILURE action with error message.', async () => {
      const promiseRetry = jest.fn(() => Promise.reject('my error'));
      utils.promiseRetry = promiseRetry;

      await reducer.voteTallyInit()(store.dispatch);

      expect(promiseRetry).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(2);
      expect(store.getActions()[0]).toEqual({
        type: reducer.TALLY_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.TALLY_FAILURE
      });
    });
  });
});
