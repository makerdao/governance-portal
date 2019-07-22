import * as reducer from '../../src/reducers/polling';
// import * as accounts from '../../src/reducers/accounts';
// import * as approvals from '../../src/reducers/approvals';
// import * as tally from '../../src/reducers/tally';
// import * as hat from '../../src/reducers/hat';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('react-ga');
jest.useFakeTimers();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

// Mock state setup
const initialState = {
  polls: []
};

const testPendingHash = 'testPendingHash';
const testMinedHash = 'testMinedHash';
// const testErrorMessage = 'testErrorMessage';

// Mock service methods
const getAllWhitelistedPolls = jest.fn();

const listenSuccess = jest.fn((txObject, txState) => {
  txState.pending({ hash: testPendingHash });
  txState.mined({ hash: testMinedHash });
});
// const listenError = jest.fn((txObject, txState) => {
//   txState.error({ hash: testPendingHash }, { message: testErrorMessage });
// });

const mockService = name => {
  if (name === 'transactionManager') return { listen: listenSuccess };
  if (name === 'govPolling') return { getAllWhitelistedPolls };
};

// const mockServiceError = name => {
//   if (name === 'transactionManager') return { listen: listenError };
//   if (name === 'voteProxy') return { voteExec };
// };

const defaultFunctions = {
  service: jest.fn(mockService)
};

describe('Vote Reducer', () => {
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
    jest.clearAllMocks();
    store = mockStore(initialState);
  });

  afterAll(() => {
    Object.assign(window, origWindow);
    delete window.web3;
    delete window.ethereum;
  });

  describe('pollsInit', () => {
    afterAll(() => {
      // Restore mock Tx manager
      defaultFunctions.service = jest.fn(mockService);
    });

    test('pollsInit test', async done => {
      await store.dispatch(reducer.pollsInit());

      expect(store.getActions().length).toBe(2);
      expect(getAllWhitelistedPolls).toBeCalledTimes(1);
      expect(store.getActions()[0]).toEqual({
        type: reducer.POLLS_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.POLLS_SUCCESS,
        payload: []
      });

      done();
    });
  });
});
