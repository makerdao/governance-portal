import each from 'jest-each';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import reducer, {
  ADD_ACCOUNT,
  FETCHING_ACCOUNT_DATA,
  HARDWARE_ACCOUNT_CONNECTED,
  HARDWARE_ACCOUNT_ERROR,
  HARDWARE_ACCOUNTS_CONNECTING,
  HARDWARE_ACCOUNTS_CONNECTED,
  HARDWARE_ACCOUNTS_ERROR,
  SET_ACTIVE_ACCOUNT,
  NO_METAMASK_ACCOUNTS,
  addAccount,
  updateAccount,
  setActiveAccount,
  addMetamaskAccount,
  connectHardwareAccounts,
  connectHardwareAccount,
  addHardwareAccount
} from '../../src/reducers/accounts';
import { AccountTypes } from '../../src/utils/constants';
import { MKR } from '../../src/chain/maker';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS
} from '../../src/reducers/sharedProxyConstants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const hotAddress = '0xHOT';
const coldAddress = '0xCOLD';
const proxyAddress = '0xPROXY';
const singleAddress = '0xSINGLE';
const proposalAddress = '0xPROPOSAL';
const proposalAddresses = [];
const slateAddress = '0xSLATE';
const defaultBalance = 100.0;
const hasInfIouApproval = true;
const hasInfMkrApproval = true;
const defaultVotingPower = 50.0;
const hasProxy = true;
const numDepositsChief = 0;

const defaults = {
  balance: defaultBalance,
  hasInfIouApproval,
  hasInfMkrApproval,
  votingPower: defaultVotingPower,
  hasProxy,
  proxy: {
    hotAddress,
    coldAddress,
    proxyAddress,
    proposalAddresses: [] // TODO use var?
  }
};

const setupMocks = (opts = defaults, services = {}) => {
  const balanceOf = jest.fn().mockReturnValue(
    Promise.resolve({
      toBigNumber: () => ({ toFixed: () => opts.balance }),
      toFixed: () => opts.balance
    })
  );
  const allowance = jest.fn().mockResolvedValue({
    eq: () => opts.hasInfMkrApproval
  });
  const getToken = jest.fn().mockReturnValue({
    balanceOf,
    allowance
  });

  const getVotedProposalAddresses = jest
    .fn()
    .mockImplementation(() => Promise.resolve(opts.proxy.proposalAddresses));
  const getNumDeposits = jest.fn().mockReturnValue({
    toBigNumber: () => ({ toFixed: () => opts.votingPower })
  });
  const getColdAddress = jest.fn().mockReturnValue(opts.proxy.coldAddress);
  const getHotAddress = jest.fn().mockReturnValue(opts.proxy.hotAddress);
  const getProxyAddress = jest.fn().mockReturnValue(opts.proxy.proxyAddress);

  const getVoteProxy = jest.fn().mockResolvedValue({
    hasProxy: opts.hasProxy,
    voteProxy: opts.hasProxy
      ? {
          getVotedProposalAddresses,
          getNumDeposits,
          getColdAddress,
          getHotAddress,
          getProxyAddress
        }
      : {}
  });

  const getNumDepositsChief = jest.fn().mockReturnValue({
    toNumber: () => opts.numDepositsChief
  });
  const getVotedSlate = jest
    .fn()
    .mockImplementation(() => Promise.resolve(opts.slateAddress));
  const getSlateAddresses = jest
    .fn()
    .mockImplementation(() => Promise.resolve(opts.proposalAddresses));

  const getContractAddressByName = jest.fn();

  const service = jest.fn().mockImplementation(service => {
    const allServices = {
      voteProxy: {
        getVoteProxy
      },
      chief: {
        getNumDeposits: getNumDepositsChief,
        getVotedSlate,
        getSlateAddresses
      },
      smartContract: { getContractAddressByName },
      ...services
    };
    return allServices[service];
  });

  window.maker = {
    getToken,
    service
  };
};

describe('Add Account with Vote Proxy', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      allAccounts: []
    });
  });

  test('should add an account enriched with information', async () => {
    setupMocks({
      balance: 200.2,
      hasInfIouApproval: false,
      hasInfMkrApproval: false,
      votingPower: 3,
      hasProxy: true,
      proxy: {
        coldAddress,
        hotAddress,
        proxyAddress,
        proposalAddresses: [proposalAddress]
      }
    });

    await addAccount({ address: hotAddress })(store.dispatch, store.getState);

    expect(window.maker.getToken).toBeCalledWith('IOU');
    expect(window.maker.getToken).toBeCalledWith(MKR);
    expect(store.getActions().length).toBe(3);
    expect(store.getActions()[0]).toEqual({
      type: FETCHING_ACCOUNT_DATA,
      payload: true
    });
    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: {
        address: hotAddress,
        mkrBalance: 200.2,
        hasProxy: true,
        proxyRole: 'hot',
        hasInfIouApproval: false,
        hasInfMkrApproval: false,
        votingFor: [proposalAddress.toLowerCase()],
        proxy: {
          address: proxyAddress,
          hasInfMkrApproval: false,
          votingPower: 3,
          linkedAccount: {
            address: coldAddress,
            mkrBalance: 200.2,
            proxyRole: 'cold'
          }
        }
      }
    });
    expect(store.getActions()[2]).toEqual({
      type: FETCHING_ACCOUNT_DATA,
      payload: false
    });
  });

  //TODO this should account for numdeps/single wallet
  test('should return hasProxy false and an empty proxy when there is no proxy and no chief deposits', async () => {
    setupMocks({
      ...defaults,
      hasProxy: false
    });

    await addAccount({ address: coldAddress })(store.dispatch, store.getState);

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        address: coldAddress,
        proxyRole: '',
        hasProxy: false,
        votingFor: [],
        proxy: expect.objectContaining({
          address: '',
          votingPower: 0,
          hasInfIouApproval: false,
          hasInfMkrApproval: false,
          linkedAccount: {}
        })
      })
    });
  });

  test('should accurately gauge proxy role based on the votingProxys hot and cold addresses', async () => {
    setupMocks(defaults);

    await addAccount({ address: coldAddress })(store.dispatch, store.getState);

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        address: coldAddress,
        proxyRole: 'cold'
      })
    });
  });

  test('should return an empty array if not voting for any proposals', async () => {
    // Override VoteProxy mock with empty voted proposal
    const getNumDeposits = jest.fn().mockReturnValue({
      toBigNumber: () => ({ toFixed: () => 0 })
    });
    const getColdAddress = jest.fn().mockReturnValue('0xCOLD');
    const getHotAddress = jest.fn().mockReturnValue('0xHOT');
    const getProxyAddress = jest.fn().mockReturnValue('0xPROXY');

    const getVotedProposalAddresses = jest
      .fn()
      .mockImplementation(() => Promise.resolve([]));

    const getVoteProxy = jest.fn().mockResolvedValue({
      hasProxy: true,
      voteProxy: {
        getVotedProposalAddresses,
        getNumDeposits,
        getColdAddress,
        getHotAddress,
        getProxyAddress
      }
    });
    setupMocks(defaults, {
      voteProxy: {
        getVotedProposalAddresses,
        getVoteProxy
      }
    });

    await addAccount({ address: coldAddress })(store.dispatch, store.getState);

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: []
      })
    });
  });

  test('should return the proposal if voting for one proposal', async () => {
    setupMocks({
      ...defaults,
      proxy: {
        ...defaults.proxy,
        proposalAddresses: [proposalAddress]
      }
    });

    await addAccount({ address: coldAddress })(store.dispatch, store.getState);

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: [proposalAddress.toLowerCase()]
      })
    });
  });

  // Since we're allowing multiple proposals, this test can probably be removed
  test.skip('should return the first proposal if voting for many proposals', async () => {
    const anotherProposalAddress = '0xPROPOSAL_2';
    setupMocks({
      ...defaults,
      proxy: {
        ...defaults.proxy,
        proposalAddresses: [proposalAddress, anotherProposalAddress]
      }
    });

    await addAccount({ address: coldAddress })(store.dispatch, store.getState);

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: [proposalAddress]
      })
    });
  });
});

describe('Add Account for Single Wallet', () => {
  let store;
  beforeEach(() => {
    store = mockStore({
      allAccounts: []
    });
  });

  test('should add a single wallet account enriched with information', async () => {
    setupMocks({
      balance: 200.2,
      hasInfIouApproval: false,
      hasInfMkrApproval: false,
      hasProxy: false,
      proposalAddresses: [proposalAddress],
      proxy: {
        coldAddress,
        hotAddress
      },
      numDepositsChief: 1
    });

    await addAccount({ address: singleAddress })(
      store.dispatch,
      store.getState
    );

    expect(window.maker.getToken).toBeCalledWith('IOU');
    expect(window.maker.getToken).toBeCalledWith(MKR);
    expect(store.getActions().length).toBe(3);
    expect(store.getActions()[0]).toEqual({
      type: FETCHING_ACCOUNT_DATA,
      payload: true
    });
    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: {
        address: singleAddress,
        mkrBalance: 200.2,
        hasProxy: false,
        singleWallet: true,
        proxyRole: '',
        votingFor: [proposalAddress.toLowerCase()],
        hasInfIouApproval: false,
        hasInfMkrApproval: false,
        proxy: {
          votingPower: 1,
          address: singleAddress,
          hasInfMkrApproval: false,
          hasInfIouApproval: false,
          linkedAccount: ''
        }
      }
    });
    expect(store.getActions()[2]).toEqual({
      type: FETCHING_ACCOUNT_DATA,
      payload: false
    });
  });

  test('should return an empty array if not voting for any proposals using a single wallet', async () => {
    setupMocks({ ...defaults, hasProxy: false, numDepositsChief: 1 });

    await addAccount({ address: singleAddress })(
      store.dispatch,
      store.getState
    );

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: []
      })
    });
  });

  test('should return the proposal if voting for one proposal with a single wallet', async () => {
    setupMocks({
      ...defaults,
      hasProxy: false,
      numDepositsChief: 1,
      slateAddress,
      proposalAddresses: [proposalAddress]
    });

    await addAccount({ address: singleAddress })(
      store.dispatch,
      store.getState
    );

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: [proposalAddress.toLowerCase()]
      })
    });
  });

  test('should return each proposal if voting for many proposals with a single wallet', async () => {
    const anotherProposalAddress = '0xPROPOSAL_2';
    setupMocks({
      ...defaults,
      hasProxy: false,
      numDepositsChief: 1,
      slateAddress,
      proposalAddresses: [proposalAddress, anotherProposalAddress]
    });

    await addAccount({ address: singleAddress })(
      store.dispatch,
      store.getState
    );

    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        votingFor: [proposalAddress, anotherProposalAddress].map(x =>
          x.toLowerCase()
        )
      })
    });
  });
});

test('UPDATE_ACCOUNT preserves unchanged values', () => {
  const state = {
    allAccounts: [
      {
        address: '0xf00',
        type: 'TEST',
        balance: 100,
        magic: true
      }
    ]
  };

  const action = updateAccount({
    address: '0xf00',
    type: 'TEST',
    balance: 98
  });

  const newState = reducer(state, action);
  expect(newState.allAccounts[0]).toEqual({
    address: '0xf00',
    type: 'TEST',
    balance: 98,
    magic: true
  });
});

const state = {
  activeAccount: '0xf00',
  allAccounts: [
    {
      address: '0xf00',
      mkrBalance: '3.1',
      proxy: {
        votingPower: '5.7',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '5.7'
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]
};

describe('setActiveAccount', () => {
  let store;
  let useAccountWithAddress;
  let addAccount;
  const existingAccount = {
    address: '0xexistingaccount'
  };

  beforeEach(() => {
    store = mockStore({
      accounts: {
        activeAccount: '',
        allAccounts: [existingAccount]
      },
      onboarding: {
        hotWallet: undefined,
        coldWallet: undefined
      }
    });

    useAccountWithAddress = jest.fn();
    addAccount = jest.fn();

    window.maker = {
      useAccountWithAddress,
      service: jest.fn().mockReturnValue({
        useAccountWithAddress,
        addAccount
      })
    };
  });

  test('it should call useAccountWithAddress on the maker object', async () => {
    await setActiveAccount(existingAccount.address)(
      store.dispatch,
      store.getState
    );

    expect(useAccountWithAddress).toBeCalledWith(existingAccount.address);
  });

  test('it fires the appropriate actions', async () => {
    await setActiveAccount(existingAccount.address)(
      store.dispatch,
      store.getState
    );

    expect(store.getActions().length).toEqual(1);
    expect(store.getActions()[0]).toEqual({
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: existingAccount,
        onboardingColdAddress: undefined,
        onboardingHotAddress: undefined
      }
    });
  });

  test('when the account fails to be added, it does not do anything', async () => {
    window.maker.useAccountWithAddress = jest
      .fn()
      .mockImplementation(() => throw 'Does not exist');

    await setActiveAccount('0xdoesnotexist')(store.dispatch, store.getState);

    expect(window.maker.useAccountWithAddress).toBeCalledWith('0xdoesnotexist');
    expect(store.getActions().length).toEqual(0);
  });
});

describe('addMetamaskAccount', () => {
  let store;
  let useAccountWithAddress;
  let addAccount;

  const existingAccount = {
    address: '0xexistingaccount'
  };
  beforeEach(() => {
    useAccountWithAddress = jest.fn();
    addAccount = jest.fn();
    setupMocks(defaults, {
      accounts: {
        useAccountWithAddress,
        addAccount
      }
    });
    store = mockStore({
      accounts: {
        activeAccount: '',
        allAccounts: [existingAccount]
      }
    });

    window.maker = {
      ...window.maker,
      useAccountWithAddress
    };
  });

  it('does not do anything if the account has already been added', async () => {
    await addMetamaskAccount(existingAccount.address)(
      store.dispatch,
      store.getState
    );

    expect(store.getActions().length).toEqual(0);
  });

  it('adds the new account', async () => {
    const newAddress = '0xNewAddress';

    await addMetamaskAccount(newAddress)(store.dispatch, store.getState);

    expect(addAccount).toHaveBeenCalledWith({ type: AccountTypes.METAMASK });
    expect(store.getActions()[1]).toEqual({
      type: ADD_ACCOUNT,
      payload: expect.objectContaining({
        address: newAddress
      })
    });
  });

  it('dispatches NO_METAMASK_ACCOUNTS if adding the account fails', async () => {
    addAccount = jest.fn().mockRejectedValue('Oops');
    setupMocks(defaults, {
      accounts: {
        useAccountWithAddress,
        addAccount
      }
    });

    await addMetamaskAccount('0xanything')(store.dispatch, store.getState);

    expect(addAccount).toHaveBeenCalledWith({ type: AccountTypes.METAMASK });
    expect(store.getActions()[0]).toEqual({
      type: NO_METAMASK_ACCOUNTS
    });
  });
});

test('locking updates account values', () => {
  const action = { type: SEND_MKR_TO_PROXY_SUCCESS, payload: '1.4' };
  const newState = reducer(state, action);
  expect(newState.allAccounts).toEqual([
    {
      address: '0xf00',
      mkrBalance: '1.7',
      proxy: {
        votingPower: '7.1',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '7.1',
        linkedAccount: {
          mkrBalance: '1.7'
        }
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]);
});

test('withdrawing updates account values', () => {
  const action = { type: WITHDRAW_MKR_SUCCESS, payload: '1.4' };
  const newState = reducer(state, action);
  expect(newState.allAccounts).toEqual([
    {
      address: '0xf00',
      mkrBalance: '4.5',
      proxy: {
        votingPower: '4.3',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '4.3',
        linkedAccount: {
          mkrBalance: '4.5'
        }
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]);
});

describe('Hardware wallets', () => {
  const LEDGER_LIVE_PATH = "44'/60'/0'";
  const LEDGER_LEGACY_PATH = "44'/60'/0'/0";
  const someAddress = '0xdeadbeef';
  const addresses = ['0xdeadbeef', '0xf00dbeef', '0xbeeffeed'];
  let store;

  const initialState = {
    onHardwareAccountChosen: jest.fn()
  };

  beforeEach(() => {
    setupMocks();

    window.maker = {
      ...window.maker,
      addAccount: jest.fn()
    };

    store = mockStore({
      accounts: initialState
    });
  });

  test('it fires the appropriate actions when a hardware wallet is connected', async () => {
    const onAccountChosen = () => {};
    window.maker.addAccount.mockImplementation(({ choose }) => {
      choose(addresses, onAccountChosen);
      return Promise.resolve();
    });

    const results = await connectHardwareAccounts(AccountTypes.LEDGER, {
      live: false
    })(store.dispatch, store.getState);

    const addressesWithTypes = addresses.map(a => ({
      address: a,
      mkrBalance: 100,
      ethBalance: 100,
      type: AccountTypes.LEDGER
    }));
    expect(results).toEqual(addressesWithTypes);
    expect(store.getActions().length).toEqual(2);
    expect(store.getActions()[0]).toEqual({
      type: HARDWARE_ACCOUNTS_CONNECTING
    });
    expect(store.getActions()[1]).toEqual({
      type: HARDWARE_ACCOUNTS_CONNECTED,
      payload: {
        onAccountChosen: onAccountChosen
      }
    });
  });

  test('it fires an error action when a hardware wallet fails to connect', async () => {
    window.maker.addAccount.mockRejectedValue('some error');

    try {
      await connectHardwareAccounts(AccountTypes.LEDGER, { live: false })(
        store.dispatch,
        store.getState
      );
    } catch (err) {
      expect(store.getActions().length).toEqual(2);
      expect(store.getActions()[0]).toEqual({
        type: HARDWARE_ACCOUNTS_CONNECTING
      });
      expect(store.getActions()[1]).toEqual({
        type: HARDWARE_ACCOUNTS_ERROR
      });
    }
  });

  test('can connect a ledger legacy wallet', async () => {
    window.maker.addAccount.mockImplementation(({ choose }) => {
      choose(addresses, () => {});
      return Promise.resolve();
    });

    await connectHardwareAccounts(AccountTypes.LEDGER, { live: false })(
      store.dispatch,
      store.getState
    );

    expect(window.maker.addAccount).toBeCalledWith({
      type: AccountTypes.LEDGER,
      path: LEDGER_LEGACY_PATH,
      accountsOffset: expect.any(Number),
      accountsLength: expect.any(Number),
      choose: expect.any(Function)
    });
  });

  test('can connect a ledger live wallet', async () => {
    window.maker.addAccount.mockImplementation(({ choose }) => {
      choose(addresses, () => {});
      return Promise.resolve();
    });

    await connectHardwareAccounts(AccountTypes.LEDGER, { live: true })(
      store.dispatch,
      store.getState
    );

    expect(window.maker.addAccount).toBeCalledWith(
      expect.objectContaining({
        type: AccountTypes.LEDGER,
        path: LEDGER_LIVE_PATH,
        accountsOffset: expect.any(Number),
        accountsLength: expect.any(Number),
        choose: expect.any(Function)
      })
    );
  });

  test('can connect a trezor wallet', async () => {
    window.maker.addAccount.mockImplementation(({ choose }) => {
      choose(addresses, () => {});
      return Promise.resolve();
    });

    await connectHardwareAccounts(AccountTypes.TREZOR)(
      store.dispatch,
      store.getState
    );

    expect(window.maker.addAccount).toBeCalledWith(
      expect.objectContaining({
        type: AccountTypes.TREZOR,
        accountsOffset: expect.any(Number),
        accountsLength: expect.any(Number),
        choose: expect.any(Function)
      })
    );
  });

  test('HARDWARE_ACCOUNTS_CONNECTED adds the callback', () => {
    const someAddress = '0xdeadbeef';
    const callback = jest.fn();
    const accounts = [
      {
        type: AccountTypes.TREZOR,
        address: someAddress
      }
    ];
    const action = {
      type: HARDWARE_ACCOUNTS_CONNECTED,
      payload: {
        onAccountChosen: callback
      }
    };
    const newState = reducer(initialState, action);
    expect(newState.onHardwareAccountChosen).toEqual(callback);
  });

  test('HARDWARE_ACCOUNT_CONNECTED clears the callback for hardware accounts', () => {
    const action = {
      type: HARDWARE_ACCOUNT_CONNECTED,
      payload: {
        accountType: AccountTypes.TREZOR
      }
    };
    const oldCallback = jest.fn();

    const newState = reducer(
      {
        ...initialState,
        onHardwareAccountChosen: oldCallback
      },
      action
    );

    expect(newState.onHardwareAccountChosen).not.toBe(oldCallback);
  });

  each([[AccountTypes.TREZOR], [AccountTypes.LEDGER]]).describe(
    'When a hardware wallet is chosen',
    async accountType => {
      test('it is added to the maker object', async () => {
        store.getState().accounts.onHardwareAccountChosen = jest
          .fn()
          .mockResolvedValue();

        await addHardwareAccount(someAddress, accountType)(
          store.dispatch,
          store.getState
        );

        expect(
          store.getState().accounts.onHardwareAccountChosen
        ).toBeCalledTimes(1);
        expect(
          store.getState().accounts.onHardwareAccountChosen
        ).toBeCalledWith(null, someAddress);
      });

      test('it fires the appropriate actions', async () => {
        store.getState().accounts.onHardwareAccountChosen.mockResolvedValue();

        await addHardwareAccount(someAddress, accountType)(
          store.dispatch,
          store.getState
        );

        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: ADD_ACCOUNT,
              payload: expect.objectContaining({
                address: someAddress,
                type: accountType
              })
            },
            {
              type: HARDWARE_ACCOUNT_CONNECTED
            }
          ])
        );
      });

      test('it fires an error when maker callback fails', async () => {
        store
          .getState()
          .accounts.onHardwareAccountChosen.mockRejectedValue('some err');

        await addHardwareAccount(someAddress, accountType)(
          store.dispatch,
          store.getState
        );

        expect(store.getActions()).toEqual(
          expect.arrayContaining([
            {
              type: HARDWARE_ACCOUNT_ERROR
            }
          ])
        );
      });
    }
  );
});
