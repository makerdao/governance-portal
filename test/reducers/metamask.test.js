import * as reducer from '../../src/reducers/metamask';
import * as tally from '../../src/reducers/tally';
import * as proposals from '../../src/reducers/proposals';
import * as hat from '../../src/reducers/hat';
import * as eth from '../../src/reducers/eth';
import * as accounts from '../../src/reducers/accounts';
import * as polling from '../../src/reducers/polling';
import { getAction } from '../helpers/getAction';
import * as ethereumUtils from '../../src/utils/ethereum';
import mixpanel from 'mixpanel-browser';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Importing actions using an alias results in empty string
const NO_METAMASK_ACCOUNTS = 'accounts/NO_METAMASK_ACCOUNTS';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
const origWindow = {};

const mockWeb3 = () => {
  const mockProvider = {
    sendAsync: ({ method }, callback) => {
      if (method === 'eth_accounts') {
        callback(null, { result: ['0xf00'] });
      }
    }
  };
  const mockVersion = {
    getNetwork: async callback => {
      callback(null, mockNetId);
    }
  };
  window.web3 = {
    currentProvider: mockProvider,
    eth: {
      defaultAccount: mockDefaultAccount
    },
    version: mockVersion
  };
  window.ethereum = {
    enable: async () => {
      window.ethereum['sendAsync'] = mockProvider.sendAsync;
    }
  };
  window.location.reload = jest.fn();
  window.maker = defaultFunctions;
};

const clearWeb3Mock = () => {
  Object.assign(window, origWindow);
  delete window.web3;
  delete window.ethereum;
};

// Mock state setup
const mockNetId = 999;
const mockDefaultAccount = 'mockDefaultAccount';
const initialState = {
  metamask: {
    activeAddress: 'mockActiveAddress'
  },
  accounts: {
    fetching: true,
    allAccounts: []
  }
};

// Mock imported action creators
const mockAction = { type: 'MOCK_ACTION', payload: true };
tally.voteTallyInit = jest.fn(() => mockAction);
proposals.proposalsInit = jest.fn(() => mockAction);
polling.pollsInit = jest.fn(() => mockAction);
hat.hatInit = jest.fn(() => mockAction);
eth.ethInit = jest.fn(() => mockAction);
accounts.setActiveAccount = jest.fn(() => mockAction);
accounts.addMetamaskAccount = jest.fn(() => mockAction);
ethereumUtils.netToUri = jest.fn();

// Mock Maker services
const defaultFunctions = {
  service: jest.fn(() => {})
};

describe('actions', () => {
  it('updateAddress should dispatch UPDATE_ADDRESS with an address', () => {
    const testAddress = '123';
    expect(reducer.updateAddress(testAddress)).toEqual({
      type: reducer.UPDATE_ADDRESS,
      payload: testAddress
    });
  });

  it('connectRequest should dispatch CONNECT_REQUEST action', () => {
    expect(reducer.connectRequest()).toEqual({
      type: reducer.CONNECT_REQUEST
    });
  });

  it('connectSuccess should dispatch CONNECT_SUCCESS with a network', () => {
    const testNetwork = 'testNetwork';
    expect(reducer.connectSuccess(testNetwork)).toEqual({
      type: reducer.CONNECT_SUCCESS,
      payload: { network: testNetwork }
    });
  });

  it('updateNetwork should dispatch UPDATE_NETWORK with a network', () => {
    const testNetwork = 'testNetwork';
    expect(reducer.updateNetwork(testNetwork)).toEqual({
      type: reducer.UPDATE_NETWORK,
      payload: { network: testNetwork }
    });
  });

  it('notAvailable should dispatch NOT_AVAILABLE action', () => {
    expect(reducer.notAvailable()).toEqual({
      type: reducer.NOT_AVAILABLE
    });
  });

  it('wrongNetwork should dispatch WRONG_NETWORK action', () => {
    expect(reducer.wrongNetwork()).toEqual({
      type: reducer.WRONG_NETWORK
    });
  });
});

describe('async actions', () => {
  beforeAll(() => {
    mixpanel.init('mockToken', 'mockConfig');
    mockWeb3();
  });
  beforeEach(() => {
    store = mockStore(initialState);
    clearWeb3Mock();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('init with valid network, but no web3 accounts', async () => {
    const network = 'mainnet';
    await store.dispatch(reducer.init(network));

    expect(tally.voteTallyInit).toBeCalledTimes(1);
    expect(proposals.proposalsInit).toBeCalledTimes(1);
    expect(proposals.proposalsInit).toBeCalledWith(network);
    expect(polling.pollsInit).toBeCalledTimes(1);
    expect(hat.hatInit).toBeCalledTimes(1);
    expect(eth.ethInit).toBeCalledTimes(1);
    expect(await getAction(store, reducer.CONNECT_REQUEST)).toEqual({
      type: reducer.CONNECT_REQUEST
    });
    expect(await getAction(store, 'accounts/NO_METAMASK_ACCOUNTS')).toEqual({
      type: NO_METAMASK_ACCOUNTS
    });
    expect(await getAction(store, reducer.NOT_AVAILABLE)).toEqual({
      type: reducer.NOT_AVAILABLE
    });
    expect(await getAction(store, reducer.CONNECT_SUCCESS)).toEqual({
      type: reducer.CONNECT_SUCCESS,
      payload: { network }
    });
    expect(await getAction(store, reducer.UPDATE_NETWORK)).toEqual({
      type: reducer.UPDATE_NETWORK,
      payload: { network }
    });
    expect(store.getActions().length).toBe(13);
  });

  test.skip('init with an invalid network, and no web3 accounts', async () => {
    const network = 'invalidNet';
    await store.dispatch(reducer.init(network));

    expect(await getAction(store, reducer.CONNECT_REQUEST)).toEqual({
      type: reducer.CONNECT_REQUEST
    });
    expect(await getAction(store, NO_METAMASK_ACCOUNTS)).toEqual({
      type: NO_METAMASK_ACCOUNTS
    });
    expect(await getAction(store, reducer.NOT_AVAILABLE)).toEqual({
      type: reducer.NOT_AVAILABLE
    });
    expect(store.getActions().length).toBe(4);
  });

  test('init with valid network and valid web3 instance', async () => {
    const network = 'mainnet';
    mockWeb3();

    await store.dispatch(reducer.init(network));
    const storeActions = store.getActions();
    expect(accounts.setActiveAccount).toBeCalledTimes(2);
    expect(accounts.addMetamaskAccount).toBeCalledTimes(2);
    expect(
      storeActions.some(obj => obj.type === reducer.CONNECT_REQUEST)
    ).toBeTruthy();
    expect(
      storeActions.some(
        obj =>
          obj.type === reducer.CONNECT_SUCCESS &&
          obj.payload.network === network
      )
    ).toBeTruthy();
    expect(
      storeActions.some(
        obj =>
          obj.type === reducer.UPDATE_NETWORK && obj.payload.network === network
      )
    ).toBeTruthy();
    expect(
      storeActions.some(
        obj =>
          obj.type === reducer.UPDATE_ADDRESS &&
          obj.payload === mockDefaultAccount
      )
    ).toBeTruthy();
    // Since our mock store doesn't get updated, initWeb3Accounts will update address again
    expect(
      storeActions.some(
        obj =>
          obj.type === reducer.UPDATE_ADDRESS &&
          obj.payload === mockDefaultAccount
      )
    ).toBeTruthy();
    expect(storeActions.length).toBe(17);
  });

  test('initWeb3Accounts and update address with web3 default address', async () => {
    mockWeb3();
    await store.dispatch(reducer.initWeb3Accounts());

    expect(accounts.setActiveAccount).toBeCalledTimes(1);
    expect(accounts.addMetamaskAccount).toBeCalledTimes(1);
    expect(await getAction(store, reducer.UPDATE_ADDRESS)).toEqual({
      type: reducer.UPDATE_ADDRESS,
      payload: mockDefaultAccount
    });
    expect(store.getActions().length).toBe(3);
  });

  test('initWeb3Accounts with no accounts should dispatch NO_METAMASK_ACCOUNTS and NOT_AVAILABLE if we are currently fetching', async () => {
    store.getState().metamask.activeAddress = '';
    await store.dispatch(reducer.initWeb3Accounts());

    expect(await getAction(store, NO_METAMASK_ACCOUNTS)).toEqual({
      type: NO_METAMASK_ACCOUNTS
    });
    expect(await getAction(store, reducer.NOT_AVAILABLE)).toEqual({
      type: reducer.NOT_AVAILABLE
    });
    expect(store.getActions().length).toBe(2);
  });

  test('initWeb3Accounts with no accounts should dispatch nothing when not fetching accounts', async () => {
    store.getState().metamask.activeAddress = '';
    store.getState().accounts.fetching = false;
    await store.dispatch(reducer.initWeb3Accounts());

    expect(store.getActions().length).toBe(0);
  });

  test('checkNetwork dispatches UPDATE_NETWORK and reloads the page when receiving a new network', async () => {
    mockWeb3();
    await store.dispatch(reducer.checkNetwork());

    expect(window.location.reload).toBeCalledTimes(1);
    expect(await getAction(store, reducer.UPDATE_NETWORK)).toEqual({
      type: reducer.UPDATE_NETWORK,
      payload: { network: ethereumUtils.netIdToName(mockNetId) }
    });
    expect(store.getActions().length).toBe(1);
  });

  test('checkNetwork dispatches nothing when receiving network existing in state', async () => {
    mockWeb3();
    store.getState().metamask.network = 'ganache';
    await store.dispatch(reducer.checkNetwork());

    expect(store.getActions().length).toBe(0);
  });

  test('pollForMetamaskChanges dispatches initWeb3Accounts and checkNetwork', async () => {
    mockWeb3();
    store.getState().metamask.network = 'oldNetwork';
    await store.dispatch(reducer.pollForMetamaskChanges());

    expect(accounts.setActiveAccount).toBeCalledTimes(1);
    expect(accounts.addMetamaskAccount).toBeCalledTimes(1);
    expect(await getAction(store, reducer.UPDATE_ADDRESS)).toEqual({
      type: reducer.UPDATE_ADDRESS,
      payload: mockDefaultAccount
    });
    expect(await getAction(store, reducer.UPDATE_NETWORK)).toEqual({
      type: reducer.UPDATE_NETWORK,
      payload: { network: ethereumUtils.netIdToName(mockNetId) }
    });
    expect(store.getActions().length).toBe(4);
  });
});
