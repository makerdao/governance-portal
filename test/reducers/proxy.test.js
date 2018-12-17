import { MKR } from '../../src/chain/maker';
import * as reducer from '../../src/reducers/proxy';
import * as sharedConstants from '../../src/reducers/sharedProxyConstants';
import * as accounts from '../../src/reducers/accounts';
import * as approvals from '../../src/reducers/approvals';
import { AccountTypes } from '../../src/utils/constants';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

jest.mock('react-ga');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
const FETCHING_ACCOUNT_DATA = 'accounts/FETCHING_ACCOUNT_DATA';
const ADD_TOAST = 'toast/ADD_TOAST';
const mockSuccessAction = { type: 'MOCK_SUCCESS_ACTION', payload: true };

// Mock state setup
const coldAddress = '0xf00bae';
const testPendingHash = 'testPendingHash';
const testMinedHash = 'testMinedHash';
const testErrorMessage = 'testErrorMessage';

const initialState = {
  accounts: {
    activeAccount: coldAddress,
    allAccounts: [
      {
        address: coldAddress,
        proxyRole: 'cold',
        hasProxy: 'true',
        proxy: {
          address: 'mockProxyAddress',
          linkedAccount: {
            address: '0xbeefed1bedded2dabbed3defaced4decade5feed',
            proxyRole: 'cold'
          }
        }
      }
    ]
  },
  proposals: ['fakeProposal'],
  proxy: {
    hotAddress: 'mockStateHotAddress',
    coldAddress: coldAddress
  }
};

// Mock service methods
const initLink = jest.fn();
const approveLink = jest.fn();
const lock = jest.fn();
const free = jest.fn();
const freeAll = jest.fn();
const breakLink = jest.fn();
const approveUnlimited = jest.fn();
approvals.initApprovalsFetch = jest.fn(() => mockSuccessAction);

const listenSuccess = jest.fn((txObject, txState) => {
  txState.pending({ hash: testPendingHash });
  txState.mined({ hash: testMinedHash });
});
const listenError = jest.fn((txObject, txState) => {
  txState.error({ hash: testPendingHash }, { message: testErrorMessage });
});

const mockService = name => {
  if (name === 'voteProxyFactory') {
    return {
      initiateLink: initLink,
      approveLink: approveLink,
      breakLink: breakLink
    };
  } else if (name === 'transactionManager') {
    return {
      listen: listenSuccess
    };
  } else if (name === 'voteProxy') {
    return {
      lock: lock,
      free: free,
      freeAll: freeAll
    };
  }
};

const mockServiceError = name => {
  if (name === 'voteProxyFactory') {
    return {
      initiateLink: initLink,
      approveLink: approveLink,
      breakLink: breakLink
    };
  } else if (name === 'transactionManager') {
    return {
      listen: listenError
    };
  } else if (name === 'voteProxy') {
    return {
      lock: lock,
      free: free,
      freeAll: freeAll
    };
  }
};

const tokenClass = token => {
  if (token === MKR) {
    return { approveUnlimited: approveUnlimited };
  }
};

const defaultFunctions = {
  currentAddress: jest.fn(() => coldAddress),
  currentAccount: jest.fn(() => initialState),
  useAccountWithAddress: jest.fn(),
  service: jest.fn(mockService),
  getToken: jest.fn(tokenClass)
};

describe('Proxy Reducer', () => {
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
    window.location.reload = jest.fn();
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

  describe('Initiate Link', () => {
    afterAll(() => {
      // Restore mock Tx manager
      defaultFunctions.service = jest.fn(mockService);
    });
    test('initiateLink should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      const mockAccounts = {
        cold: {
          type: AccountTypes.METAMASK,
          address: coldAddress
        },
        hot: {
          address: 'mockHotAddress'
        }
      };

      await store.dispatch(reducer.initiateLink(mockAccounts));
      expect(initLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: SET_ACTIVE_ACCOUNT,
        payload: expect.any(String)
      });
      expect(store.getActions()[1]).toEqual({
        type: sharedConstants.INITIATE_LINK_REQUEST,
        payload: {
          hotAddress: expect.any(String),
          coldAddress: expect.any(String)
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.INITIATE_LINK_SENT,
        payload: {
          txHash: testPendingHash
        }
      });
      expect(store.getActions()[3]).toEqual({
        type: reducer.INITIATE_LINK_SUCCESS,
        payload: ''
      });
    });

    test('Initiate Link should dispatch FAILURE action when TxMgr calls error', async () => {
      // Setup mock Tx manager to return an error
      defaultFunctions.service = jest.fn(mockServiceError);

      const mockAccounts = {
        cold: {
          type: AccountTypes.METAMASK,
          address: coldAddress
        },
        hot: {
          address: 'mockHotAddress'
        }
      };
      await store.dispatch(reducer.initiateLink(mockAccounts));

      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: SET_ACTIVE_ACCOUNT,
        payload: expect.any(String)
      });
      expect(store.getActions()[1]).toEqual({
        type: sharedConstants.INITIATE_LINK_REQUEST,
        payload: {
          hotAddress: expect.any(String),
          coldAddress: expect.any(String)
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.INITIATE_LINK_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[3]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Approve Link', () => {
    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('approveLink should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', () => {
      const mockAccounts = {
        hotAccount: {
          type: AccountTypes.METAMASK,
          address: coldAddress,
          proxyRole: 'someProxyRole'
        }
      };

      store.dispatch(reducer.approveLink(mockAccounts));
      expect(approveLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[1]).toEqual({
        type: reducer.APPROVE_LINK_REQUEST
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.APPROVE_LINK_SENT,
        payload: {
          txHash: testPendingHash
        }
      });
      expect(store.getActions()[3]).toEqual({
        type: reducer.APPROVE_LINK_SUCCESS,
        payload: {
          coldAddress: expect.any(String),
          hotAddress: expect.any(String)
        }
      });
    });

    test('Approve Link should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      const mockAccounts = {
        hotAccount: {
          type: AccountTypes.METAMASK,
          address: coldAddress,
          proxyRole: 'someProxyRole'
        }
      };

      await store.dispatch(reducer.approveLink(mockAccounts));

      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[1]).toEqual({
        type: reducer.APPROVE_LINK_REQUEST
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.APPROVE_LINK_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[3]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Lock', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Lock should not call voteProxyService when value is 0', async () => {
      await store.dispatch(reducer.lock(0));
      expect(lock).not.toBeCalled();
    });

    test('Lock should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(reducer.lock(mockValue));

      expect(lock).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(5);
      expect(store.getActions()[1]).toEqual({
        type: reducer.SEND_MKR_TO_PROXY_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.SEND_MKR_TO_PROXY_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[3]).toEqual({
        type: sharedConstants.SEND_MKR_TO_PROXY_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[4]).toEqual(mockSuccessAction);
    });

    test('Lock should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(reducer.lock(mockValue));

      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[1]).toEqual({
        type: reducer.SEND_MKR_TO_PROXY_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.SEND_MKR_TO_PROXY_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[3]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Free', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Free should not call voteProxyService when value is 0', async () => {
      await store.dispatch(reducer.free(0));
      expect(free).not.toBeCalled();
    });

    test('Free should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', () => {
      store.dispatch(reducer.free(mockValue));

      expect(free).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_MKR_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.WITHDRAW_MKR_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[3]).toEqual(mockSuccessAction);
    });

    test('Free should dispatch FAILURE action when TxMgr calls error', () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      store.dispatch(reducer.free(mockValue));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_MKR_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[2]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Free All', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Free All should not call voteProxyService when value is 0', async () => {
      await store.dispatch(reducer.freeAll(0));
      expect(freeAll).not.toBeCalled();
    });

    test('Free All should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', () => {
      store.dispatch(reducer.freeAll(mockValue));

      expect(freeAll).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_ALL_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_ALL_MKR_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.WITHDRAW_ALL_MKR_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[3]).toEqual(mockSuccessAction);
    });

    test('Free All should dispatch FAILURE action when TxMgr calls error', () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      store.dispatch(reducer.freeAll(mockValue));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.WITHDRAW_ALL_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.WITHDRAW_ALL_MKR_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[2]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Break Link', () => {
    const mockAction = { type: FETCHING_ACCOUNT_DATA, payload: true };
    accounts.addAccounts = jest.fn(() => mockAction);

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Break Link should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(reducer.breakLink());

      expect(breakLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.BREAK_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.BREAK_LINK_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.BREAK_LINK_SUCCESS,
        payload: ''
      });
    });

    test('Break Link should dispatch FAILURE action when TxMgr calls error', () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      store.dispatch(reducer.breakLink());
      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: reducer.BREAK_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: reducer.BREAK_LINK_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[2]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });

  describe('Smart Step Skip', () => {
    test('Smart Step Skip should dispatch GO_TO_STEP action when setupProgress is "lockInput"', () => {
      initialState.proxy.setupProgress = 'lockInput';
      store = mockStore(initialState);

      store.dispatch(reducer.smartStepSkip());

      expect(store.getActions().length).toBe(1);
      expect(store.getActions()[0]).toEqual({
        type: reducer.GO_TO_STEP,
        payload: 'summary'
      });
    });
  });

  describe('mkrApproveProxy', () => {
    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });
    test('mkrApproveProxy should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', () => {
      store.dispatch(reducer.mkrApproveProxy());

      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[1]).toEqual({
        type: reducer.MKR_APPROVE_REQUEST
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.MKR_APPROVE_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[3]).toEqual({
        type: reducer.MKR_APPROVE_SUCCESS,
        payload: ''
      });
    });

    test('mkrApproveProxy should dispatch FAILURE action when TxMgr calls error', () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      store.dispatch(reducer.mkrApproveProxy());
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[1]).toEqual({
        type: reducer.MKR_APPROVE_REQUEST
      });
      expect(store.getActions()[2]).toEqual({
        type: reducer.MKR_APPROVE_FAILURE,
        payload: { message: testErrorMessage }
      });
      expect(store.getActions()[3]).toEqual({
        type: ADD_TOAST,
        payload: {
          toast: expect.any(Object)
        }
      });
    });
  });
});
