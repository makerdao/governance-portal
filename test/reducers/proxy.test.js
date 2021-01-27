import { MKR } from '../../src/chain/maker';
import reducer, * as proxy from '../../src/reducers/proxy';
import * as sharedConstants from '../../src/reducers/sharedProxyConstants';
import * as accounts from '../../src/reducers/accounts';
import { AccountTypes, TransactionStatus } from '../../src/utils/constants';
import * as approvals from '../../src/reducers/approvals';

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
const hotAddress = '0xbeefed1bedded2dabbed3defaced4decade5feed';
const testPendingHash = 'testPendingHash';
const testMinedHash = 'testMinedHash';
const testErrorMessage = 'testErrorMessage';
const mockProxyTx = { proxyAddress: '0xt3St' };

const currentAccount = {
  address: coldAddress,
  proxyRole: 'cold',
  hasProxy: 'true',
  proxy: {
    address: 'mockProxyAddress',
    linkedAccount: {
      address: hotAddress,
      proxyRole: 'hot'
    }
  }
};

const initialState = {
  accounts: {
    activeAccount: coldAddress,
    allAccounts: [currentAccount]
  },
  onboarding: {
    hotWallet: {
      address: hotAddress
    },
    coldWallet: {
      address: coldAddress
    }
  },
  proposals: ['fakeProposal'],
  proxy: {
    sendMkrTxHash: '',
    initiateLinkTxHash: '',
    approveLinkTxHash: '',
    mkrApproveProxyTxHash: '',
    withdrawMkrTxHash: '',
    breakLinkTxHash: '',
    initiateLinkTxStatus: TransactionStatus.NOT_STARTED,
    approveLinkTxStatus: TransactionStatus.NOT_STARTED,
    mkrApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
    iouApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
    sendMkrTxStatus: TransactionStatus.NOT_STARTED,
    withdrawMkrTxStatus: TransactionStatus.NOT_STARTED,
    breakLinkTxStatus: TransactionStatus.NOT_STARTED
  }
};

// Mock service methods
const initLink = jest.fn();
const approveLink = jest.fn(() => Promise.resolve(mockProxyTx));
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
  currentAccount: jest.fn(() => currentAccount),
  useAccountWithAddress: jest.fn(),
  service: jest.fn(mockService),
  getToken: jest.fn(tokenClass)
};

describe('Proxy Reducer', () => {
  beforeAll(() => {
    window.location.reload = jest.fn();
    window.maker = defaultFunctions;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    store = mockStore(initialState);
  });

  afterAll(() => {
    Object.assign(window, origWindow);
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
          address: coldAddress
        }
      };

      await store.dispatch(proxy.initiateLink(mockAccounts));
      expect(initLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: proxy.INITIATE_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.INITIATE_LINK_SENT,
        payload: {
          txHash: testPendingHash
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: proxy.INITIATE_LINK_SUCCESS,
        payload: ''
      });
      expect(store.getActions()[3]).toEqual({
        type: accounts.FETCHING_ACCOUNT_DATA,
        payload: true
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
      await store.dispatch(proxy.initiateLink(mockAccounts));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.INITIATE_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.INITIATE_LINK_FAILURE,
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

  describe('Approve Link', () => {
    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('approveLink should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      const mockAccounts = {
        hot: {
          type: AccountTypes.METAMASK,
          address: coldAddress,
          proxyRole: 'someProxyRole'
        },
        cold: {
          type: AccountTypes.LEDGER,
          address: coldAddress
        }
      };

      await store.dispatch(proxy.approveLink(mockAccounts));
      expect(approveLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(5);
      expect(store.getActions()[0]).toEqual({
        type: proxy.APPROVE_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.APPROVE_LINK_SENT,
        payload: {
          txHash: testPendingHash
        }
      });
      expect(store.getActions()[2]).toEqual({
        type: proxy.APPROVE_LINK_SUCCESS,
        payload: ''
      });
      expect(store.getActions()[3]).toEqual({
        type: proxy.STORE_PROXY_ADDRESS,
        payload: mockProxyTx.proxyAddress
      });
      expect(store.getActions()[4]).toEqual({
        type: accounts.FETCHING_ACCOUNT_DATA,
        payload: true
      });
    });

    test('Approve Link should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      const mockAccounts = {
        hot: {
          type: AccountTypes.METAMASK,
          address: coldAddress,
          proxyRole: 'someProxyRole'
        },
        cold: {
          type: AccountTypes.LEDGER,
          address: coldAddress
        }
      };

      await store.dispatch(proxy.approveLink(mockAccounts));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.APPROVE_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.APPROVE_LINK_FAILURE,
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

  describe('Lock', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Lock should not call voteProxyService when value is 0', async () => {
      await store.dispatch(proxy.lock(0));
      expect(lock).not.toBeCalled();
    });

    test('Lock should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(proxy.lock(mockValue));

      expect(lock).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: proxy.SEND_MKR_TO_PROXY_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.SEND_MKR_TO_PROXY_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.SEND_MKR_TO_PROXY_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[3]).toEqual(mockSuccessAction);
    });

    test('Lock should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.lock(mockValue));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.SEND_MKR_TO_PROXY_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.SEND_MKR_TO_PROXY_FAILURE,
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

  describe('Free', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Free should not call voteProxyService when value is 0', async () => {
      await store.dispatch(proxy.free(0));
      expect(free).not.toBeCalled();
    });

    test('Free should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(proxy.free(mockValue));

      expect(free).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: proxy.WITHDRAW_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.WITHDRAW_MKR_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.WITHDRAW_MKR_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[3]).toEqual(mockSuccessAction);
    });

    test('Free should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.free(mockValue));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.WITHDRAW_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.WITHDRAW_MKR_FAILURE,
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
  describe('FreeAll', () => {
    const mockValue = 5;

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('freeAll should not call voteProxyService when value is 0', async () => {
      await store.dispatch(proxy.freeAll(0));
      expect(freeAll).not.toBeCalled();
    });

    test('freeAll should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(proxy.freeAll(mockValue));

      expect(freeAll).toBeCalledTimes(1);
      expect(approvals.initApprovalsFetch).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: proxy.WITHDRAW_ALL_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.WITHDRAW_ALL_MKR_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.WITHDRAW_ALL_MKR_SUCCESS,
        payload: mockValue
      });
      expect(store.getActions()[3]).toEqual(mockSuccessAction);
    });

    test('freeAll should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.freeAll(mockValue));

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.WITHDRAW_ALL_MKR_REQUEST,
        payload: mockValue
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.WITHDRAW_ALL_MKR_FAILURE,
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
    const mockValue = 5;
    accounts.addAccounts = jest.fn(() => mockAction);

    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });

    test('Break Link should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(proxy.breakLink());
      expect(breakLink).toBeCalledTimes(1);
      expect(store.getActions().length).toBe(4);
      expect(store.getActions()[0]).toEqual({
        type: proxy.BREAK_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.BREAK_LINK_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: proxy.BREAK_LINK_SUCCESS,
        payload: ''
      });
    });

    test('Break Link should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.breakLink());

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.BREAK_LINK_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.BREAK_LINK_FAILURE,
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

  describe('mkrApproveProxy', () => {
    afterAll(() => {
      defaultFunctions.service = jest.fn(mockService);
    });
    test('mkrApproveProxy should dispatch SENT and SUCCESS actions when TxMgr calls pending and mined respectively', async () => {
      await store.dispatch(proxy.mkrApproveProxy());

      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.MKR_APPROVE_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.MKR_APPROVE_SENT,
        payload: { txHash: testPendingHash }
      });
      expect(store.getActions()[2]).toEqual({
        type: sharedConstants.MKR_APPROVE_SUCCESS,
        payload: ''
      });
    });

    test('mkrApproveProxy should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.mkrApproveProxy());
      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.MKR_APPROVE_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.MKR_APPROVE_FAILURE,
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

  describe('When the active account is changed', () => {
    const someState = {
      sendMkrTxHash: '0xsometing',
      initiateLinkTxHash: 'oxsomethingelse',
      approveLinkTxHash: '',
      mkrApproveProxyTxHash: '',
      withdrawMkrTxHash: '',
      breakLinkTxHash: '',
      initiateLinkTxStatus: TransactionStatus.MINED,
      iouApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
      approveLinkTxStatus: TransactionStatus.ERROR,
      mkrApproveProxyTxStatus: TransactionStatus.NOT_STARTED,
      sendMkrTxStatus: TransactionStatus.NOT_STARTED,
      withdrawMkrTxStatus: TransactionStatus.NOT_STARTED,
      breakLinkTxStatus: TransactionStatus.NOT_STARTED
    };

    test('the proxy is reverted to its original state if it is not the same as the current onboarding hot/cold wallets', () => {
      const action = {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: '0xdeadbeef'
          },
          onboardingHotAddress: '0xhot',
          onboardingColdAddress: '0xcold'
        }
      };
      const newState = reducer(someState, action);

      expect(newState).toEqual(initialState.proxy);
    });

    test('the proxy state is left intact it if the new account is the same as the current onboarding hot wallet', () => {
      const action = {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: '0xhot'
          },
          onboardingHotAddress: '0xhot',
          onboardingColdAddress: '0xcold'
        }
      };
      const newState = reducer(someState, action);

      expect(newState).toEqual(someState);
    });

    test('the proxy state is left intact it if the new account is the same as the current onboarding cold wallet', () => {
      const action = {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: '0xcold'
          },
          onboardingHotAddress: '0xhot',
          onboardingColdAddress: '0xcold'
        }
      };
      const newState = reducer(someState, action);

      expect(newState).toEqual(someState);
    });

    test('mkrApproveProxy should dispatch FAILURE action when TxMgr calls error', async () => {
      defaultFunctions.service = jest.fn(mockServiceError);

      await store.dispatch(proxy.mkrApproveProxy());
      expect(store.getActions().length).toBe(3);
      expect(store.getActions()[0]).toEqual({
        type: proxy.MKR_APPROVE_REQUEST
      });
      expect(store.getActions()[1]).toEqual({
        type: proxy.MKR_APPROVE_FAILURE,
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
});
