import * as reducer from '../../src/reducers/vote';
import * as accounts from '../../src/reducers/accounts';
import * as approvals from '../../src/reducers/approvals';
import * as tally from '../../src/reducers/tally';
import * as hat from '../../src/reducers/hat';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('react-ga');
jest.useFakeTimers();

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

const ADD_TOAST = 'toast/ADD_TOAST';
const mockAction = { type: 'MOCK_ACTION' };

// Mock state setup
const initialState = {
  hat: { address: '0xaBc' },
  proposals: ['propA', 'propB']
};
const mockCurrentAddress = '0xf00CA';

const mockProposalAddress = 'mockProposalAddress';
const activeAccount = {
  hasProxy: true,
  votingFor: [mockProposalAddress],
  proxy: {
    linkedAccount: {
      address: 'mockLinkedAccountAddress'
    }
  }
};

const testPendingHash = 'testPendingHash';
const testMinedHash = 'testMinedHash';
const testErrorMessage = 'testErrorMessage';

// Mock service methods
const voteExec = jest.fn();

const listenSuccess = jest.fn((txObject, txState) => {
  txState.pending({ hash: testPendingHash });
  txState.mined({ hash: testMinedHash });
});
const listenError = jest.fn((txObject, txState) => {
  txState.error({ hash: testPendingHash }, { message: testErrorMessage });
});

const mockService = name => {
  if (name === 'transactionManager') return { listen: listenSuccess };
  if (name === 'voteProxy') return { voteExec };
};

const mockServiceError = name => {
  if (name === 'transactionManager') return { listen: listenError };
  if (name === 'voteProxy') return { voteExec };
};

const defaultFunctions = {
  service: jest.fn(mockService),
  currentAddress: jest.fn(() => mockCurrentAddress)
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

  describe('Send Vote', () => {
    afterAll(() => {
      // Restore mock Tx manager
      defaultFunctions.service = jest.fn(mockService);
    });

    test('send vote should throw an error if active account has no proxy', async () => {
      const noProxyAccount = { hasProxy: false };

      // Get account returns an invalid account:
      accounts.getAccount = jest.fn(() => noProxyAccount);
      expect.assertions(2);

      try {
        await store.dispatch(reducer.sendVote(mockProposalAddress));
      } catch (err) {
        expect(err.message).toEqual('must have account active');
        expect(err instanceof Error).toBeTruthy();
      }
    });

    test('send vote should dispatch SENT & SUCCESS actions with successful transaction, then UPDATE both accounts.', async done => {
      const getAccount = jest.fn(() => activeAccount);
      accounts.getAccount = getAccount;

      const initApprovalsFetch = jest.fn(() => mockAction);
      approvals.initApprovalsFetch = initApprovalsFetch;

      const voteTallyInit = jest.fn(() => mockAction);
      tally.voteTallyInit = voteTallyInit;

      const hatInit = jest.fn(() => mockAction);
      hat.hatInit = hatInit;

      await store.dispatch(reducer.sendVote(mockProposalAddress));

      jest.runAllTimers();

      expect(store.getActions().length).toBe(8);
      expect(voteExec).toBeCalledTimes(1);
      expect(store.getActions()[0]).toEqual({
        type: reducer.VOTE_REQUEST,
        payload: {
          address: mockProposalAddress
        }
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.VOTE_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.VOTE_SUCCESS
      });
      expect(store.getActions()[3]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: [mockProposalAddress.toLowerCase()]
        }
      });
      expect(store.getActions()[4]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: [mockProposalAddress.toLowerCase()]
        }
      });

      expect(getAccount).toBeCalledTimes(2);
      expect(initApprovalsFetch).toBeCalledTimes(1);
      expect(voteTallyInit).toBeCalledTimes(1);
      expect(hatInit).toBeCalledTimes(1);

      done();
    });

    test('send vote should dispatch FAILURE action when TxMgr calls error', async () => {
      // Setup mock Tx manager to return an error
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(reducer.sendVote(mockProposalAddress));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.VOTE_REQUEST,
        payload: {
          address: mockProposalAddress
        }
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.VOTE_FAILURE,
        payload: {
          message: testErrorMessage
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Withdraw Vote', () => {
    afterAll(() => {
      // Restore mock Tx manager
      defaultFunctions.service = jest.fn(mockService);
    });

    test('withdraw vote should throw an error if active account has no proxy', async () => {
      const noProxyAccount = { hasProxy: false };

      accounts.getAccount = jest.fn(() => noProxyAccount);
      expect.assertions(2);

      try {
        await store.dispatch(reducer.withdrawVote(mockProposalAddress));
      } catch (err) {
        expect(err.message).toEqual('must have account active');
        expect(err instanceof Error).toBeTruthy();
      }
    });

    test('withdraw vote should dispatch SENT & SUCCESS actions with successful transaction, then UPDATE both accounts.', async done => {
      const getAccount = jest.fn(() => activeAccount);
      accounts.getAccount = getAccount;

      const initApprovalsFetch = jest.fn(() => mockAction);
      approvals.initApprovalsFetch = initApprovalsFetch;

      const voteTallyInit = jest.fn(() => mockAction);
      tally.voteTallyInit = voteTallyInit;

      const hatInit = jest.fn(() => mockAction);
      hat.hatInit = hatInit;
      voteExec.mockClear();

      await store.dispatch(reducer.withdrawVote(mockProposalAddress));

      jest.runAllTimers();

      expect(store.getActions().length).toBe(8);
      expect(voteExec).toBeCalledTimes(1);
      expect(voteExec).toBeCalledWith(undefined, []);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.WITHDRAW_SUCCESS
      });
      expect(store.getActions()[3]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: []
        }
      });
      expect(store.getActions()[4]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: []
        }
      });

      expect(getAccount).toBeCalledTimes(2);
      expect(initApprovalsFetch).toBeCalledTimes(1);
      expect(voteTallyInit).toBeCalledTimes(1);
      expect(hatInit).toBeCalledTimes(1);

      done();
    });

    test('withdraw vote should dispatch FAILURE action when TxMgr calls error', async () => {
      // Setup mock Tx manager to return an error
      defaultFunctions.service = jest.fn(mockServiceError);
      await store.dispatch(reducer.withdrawVote(mockProposalAddress));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_FAILURE,
        payload: {
          message: testErrorMessage
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });
});
