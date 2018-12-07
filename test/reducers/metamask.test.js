import * as reducer from '../../src/reducers/metamask';
import * as utils from '../../src/utils/misc';
import * as tally from '../../src/reducers/tally';
import * as proposals from '../../src/reducers/proposals';
import * as hat from '../../src/reducers/hat';
import * as eth from '../../src/reducers/eth';
import * as accounts from '../../src/reducers/accounts';
import { getAction } from '../helpers/getAction';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let store;
let maker;
const origWindow = {};

const mockWeb3 = () => {
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
      defaultAccount: mockDefaultAccount
    }
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

const mockAction = { type: 'MOCK_ACTION', payload: true };

// reducer.initWeb3Accounts = jest.fn(jest.fn());
// reducer.initWeb3Accounts = jest.fn(() => Promise.resolve(mockAction));
tally.voteTallyInit = jest.fn(() => mockAction);
proposals.proposalsInit = jest.fn(() => mockAction);
hat.hatInit = jest.fn(() => mockAction);
eth.ethInit = jest.fn(() => mockAction);
accounts.setActiveAccount = jest.fn(() => mockAction);

// tally.voteTallyInit = jest.fn(() => mockAction);

// approvals.initApprovalsFetch = jest.fn(() => mockSuccessAction);

const setProvider = jest.fn();
const mockService = name => {
  if (name === 'web3') {
    return {
      _web3: {
        setProvider: setProvider
      }
    };
  }
};
const defaultFunctions = {
  service: jest.fn(mockService)
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
  //end describe actions
});

describe('async actions', () => {
  beforeAll(() => {
    maker = defaultFunctions;
    mockWeb3();
  });
  beforeEach(() => {
    store = mockStore(initialState);
  });
  afterEach(() => {
    // fetchMock.restore();
    jest.clearAllMocks();
  });

  test('init with valid network, but no web3 accounts', async () => {
    clearWeb3Mock();
    // const pfm = reducer.pollForMetamaskChanges
    // reducer.pollForMetamaskChanges = jest.fn(() => 'TEST POLL');
    const network = 'mainnet';
    await reducer.init(maker, network)(store.dispatch);
    /**TODO
     * Check InitWeb3Accounts here
     */
    // expect(reducer.pollForMetamaskChanges).toBeCalledTimes(1);

    expect(setProvider).toBeCalledTimes(1);
    expect(tally.voteTallyInit).toBeCalledTimes(1);
    expect(proposals.proposalsInit).toBeCalledTimes(1);
    expect(proposals.proposalsInit).toBeCalledWith(network);
    expect(hat.hatInit).toBeCalledTimes(1);
    expect(eth.ethInit).toBeCalledTimes(1);

    expect(await getAction(store, reducer.CONNECT_REQUEST)).toEqual({
      type: reducer.CONNECT_REQUEST
    });
    expect(await getAction(store, reducer.CONNECT_SUCCESS)).toEqual({
      type: reducer.CONNECT_SUCCESS,
      payload: { network }
    });
    expect(await getAction(store, 'accounts/NO_METAMASK_ACCOUNTS')).toEqual({
      type: 'accounts/NO_METAMASK_ACCOUNTS'
    });
    expect(await getAction(store, reducer.NOT_AVAILABLE)).toEqual({
      type: reducer.NOT_AVAILABLE
    });
    expect(await getAction(store, reducer.UPDATE_NETWORK)).toEqual({
      type: reducer.UPDATE_NETWORK,
      payload: { network }
    });
    expect(store.getActions().length).toBe(9);
  });

  test('init with an invalid network, and no web3 accounts', async () => {
    clearWeb3Mock();
    const network = 'invalidNet';
    await reducer.init(maker, network)(store.dispatch);

    expect(await getAction(store, reducer.CONNECT_REQUEST)).toEqual({
      type: reducer.CONNECT_REQUEST
    });
    expect(await getAction(store, 'accounts/NO_METAMASK_ACCOUNTS')).toEqual({
      type: 'accounts/NO_METAMASK_ACCOUNTS'
    });
    expect(await getAction(store, reducer.NOT_AVAILABLE)).toEqual({
      type: reducer.NOT_AVAILABLE
    });
    expect(await getAction(store, reducer.WRONG_NETWORK)).toEqual({
      type: reducer.WRONG_NETWORK
    });
    expect(store.getActions().length).toBe(5);
  });

  test.skip('init with valid network and valid web3 instance', async () => {
    mockWeb3();
    // jest.spyOn(reducer, 'initWeb3Accounts');
    // reducer.initWeb3Accounts = jest.fn();
    reducer.initWeb3Accounts = jest.fn(() => mockAction);

    const network = 'mainnet';
    await reducer.init(maker, network)(store.dispatch);

    // expect(reducer.initWeb3Accounts).toBeCalledTimes(1);
    expect(reducer.initWeb3Accounts).toHaveBeenCalled();
  });

  test('initWeb3Accounts and update address with web3 default address', async () => {
    mockWeb3();
    await reducer.initWeb3Accounts()(store.dispatch, store.getState);

    expect(accounts.setActiveAccount).toBeCalledTimes(1);
    expect(await getAction(store, reducer.UPDATE_ADDRESS)).toEqual({
      type: reducer.UPDATE_ADDRESS,
      payload: mockDefaultAccount
    });
    expect(store.getActions().length).toBe(2);
    console.log(store.getActions());
  });

  test.skip('initWeb3Accounts with no default address, and we are fetching', async () => {
    mockWeb3();
    store.getState().metamask.activeAddress = null;
    window.web3.eth.defaultAccount = mockDefaultAccount;

    await reducer.initWeb3Accounts()(store.dispatch, store.getState);

    // expect(accounts.setActiveAccount).toBeCalledTimes(1);
    // expect(await getAction(store, reducer.UPDATE_ADDRESS)).toEqual({
    //   type: reducer.UPDATE_ADDRESS,
    //   payload: mockDefaultAccount
    // });
    // expect(store.getActions().length).toBe(2);
    console.log(store.getState());
    console.log(store.getActions());
  });
});
