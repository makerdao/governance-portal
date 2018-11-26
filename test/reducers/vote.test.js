import * as reducer from '../../src/reducers/vote';
import * as accounts from '../../src/reducers/accounts';
import * as approvals from '../../src/reducers/approvals';
import * as tally from '../../src/reducers/tally';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('react-ga');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

const ADD_TOAST = 'toast/ADD_TOAST';
const mockAction = { type: 'MOCK_ACTION' };

// Mock state setup
const initialState = {};
const mockCurrentAddress = '0xf00CA';

const mockProposalAddress = 'mockProposalAddress';
const activeAccount = {
  hasProxy: true,
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
        await reducer.sendVote(mockProposalAddress)(
          store.dispatch,
          store.getState
        );
      } catch (err) {
        expect(err.message).toEqual('must have account active');
        expect(err instanceof Error).toBeTruthy();
      }
    });

    test('send vote should dispatch SENT & SUCCESS actions with successful transaction, then UPDATE both accounts.', async () => {
      const getAccount = jest.fn(() => activeAccount);
      accounts.getAccount = getAccount;

      const initApprovalsFetch = jest.fn(() => mockAction);
      approvals.initApprovalsFetch = initApprovalsFetch;

      const voteTallyInit = jest.fn(() => mockAction);
      tally.voteTallyInit = voteTallyInit;

      await reducer.sendVote(mockProposalAddress)(
        store.dispatch,
        store.getState
      );

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
      expect(store.getActions()[5]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: mockProposalAddress
        }
      });
      expect(store.getActions()[6]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: mockProposalAddress
        }
      });

      expect(getAccount).toBeCalledTimes(2);
      expect(initApprovalsFetch).toBeCalledTimes(1);
      expect(voteTallyInit).toBeCalledTimes(1);
    });

    test('send vote should dispatch FAILURE action when TxMgr calls error', async () => {
      // Setup mock Tx manager to return an error
      defaultFunctions.service = jest.fn(mockServiceError);

      await reducer.sendVote(mockProposalAddress)(
        store.dispatch,
        store.getState
      );

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
        await reducer.withdrawVote()(store.dispatch, store.getState);
      } catch (err) {
        expect(err.message).toEqual('must have account active');
        expect(err instanceof Error).toBeTruthy();
      }
    });

    test('withdraw vote should dispatch SENT & SUCCESS actions with successful transaction, then UPDATE both accounts.', async () => {
      const getAccount = jest.fn(() => activeAccount);
      accounts.getAccount = getAccount;

      const initApprovalsFetch = jest.fn(() => mockAction);
      approvals.initApprovalsFetch = initApprovalsFetch;

      const voteTallyInit = jest.fn(() => mockAction);
      tally.voteTallyInit = voteTallyInit;

      await reducer.withdrawVote()(store.dispatch, store.getState);

      expect(voteExec).toBeCalledTimes(1);
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
      expect(store.getActions()[5]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: ''
        }
      });
      expect(store.getActions()[6]).toEqual({
        type: accounts.UPDATE_ACCOUNT,
        payload: {
          ...activeAccount,
          votingFor: ''
        }
      });

      expect(getAccount).toBeCalledTimes(2);
      expect(initApprovalsFetch).toBeCalledTimes(1);
      expect(voteTallyInit).toBeCalledTimes(1);
    });

    test('withdraw vote should dispatch FAILURE action when TxMgr calls error', async () => {
      // Setup mock Tx manager to return an error
      defaultFunctions.service = jest.fn(mockServiceError);
      await reducer.withdrawVote()(store.dispatch, store.getState);

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
