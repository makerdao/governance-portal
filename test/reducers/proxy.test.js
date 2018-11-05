import * as maker from '../../src/chain/maker';
import * as reducer from '../../src/reducers/proxy';
import { AccountTypes } from '../../src/utils/constants';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'jest-fetch-mock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

//TODO: should we just export these in the reducer?
const INITIATE_LINK_SENT = 'proxy/INITIATE_LINK_SENT';
const INITIATE_LINK_SUCCESS = 'proxy/INITIATE_LINK_SUCCESS';
const INITIATE_LINK_FAILURE = 'proxy/INITIATE_LINK_FAILUREs';

const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';

describe('Initiate Link', () => {
  const origWindow = {};
  const initialState = {
    accounts: {
      allAccounts: []
    },
    proxy: {
      hotAddress: 'mockStateHotAddress'
    }
  };
  const coldAddress = '0xf00bae';

  const store = mockStore(initialState);
  const initLink = jest.fn();

  const mockService = name => {
    console.log(name);
    if (name === 'voteProxyFactory') {
      return { initiateLink: initLink };
    } else if (name === 'transactionManager') {
      return {
        listen: jest.fn((txObject, txState) => {
          txState.pending({ hash: 'testPendingHash' });
          txState.mined({ hash: 'testMinedHash' });
        })
      };
    }
  };

  const defaultFunctions = {
    currentAddress: jest.fn(() => coldAddress),
    currentAccount: jest.fn(),
    useAccountWithAddress: jest.fn(),
    service: jest.fn(mockService)
  };

  maker.default = defaultFunctions;

  beforeAll(async () => {
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
  });

  afterEach(() => {
    Object.assign(window, origWindow);
    delete window.web3;
    delete window.ethereum;
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

    await reducer
      .initiateLink(mockAccounts)(store.dispatch, store.getState)
      .then(() => {
        expect(initLink).toBeCalledTimes(1);
        expect(store.getActions().length).toBe(4);
        expect(store.getActions()[0]).toEqual({
          type: SET_ACTIVE_ACCOUNT,
          payload: expect.any(String)
        });
        expect(store.getActions()[1]).toEqual({
          type: reducer.INITIATE_LINK_REQUEST,
          payload: expect.objectContaining({
            hotAddress: expect.any(String),
            coldAddress: expect.any(String)
          })
        });
        expect(store.getActions()[2]).toEqual({
          type: INITIATE_LINK_SENT,
          payload: expect.objectContaining({
            txHash: expect.any(String)
          })
        });
        expect(store.getActions()[3]).toEqual({
          type: INITIATE_LINK_SUCCESS,
          payload: ''
        });
      });

    console.log('store actions>', store.getActions());
  });
});
