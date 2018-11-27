import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import differenceWith from 'ramda/src/differenceWith';
import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { AccountTypes } from '../utils/constants';
import { add, eq, subtract, toNum, promisedProperties } from '../utils/misc';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  WITHDRAW_ALL_MKR_SUCCESS,
  INITIATE_LINK_REQUEST
} from './sharedProxyConstants';
import { MAX_UINT_ETH_BN } from '../utils/ethereum';
import { ETH, MKR } from '../chain/maker';

// Constants ----------------------------------------------

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

const REMOVE_ACCOUNTS = 'accounts/REMOVE_ACCOUNTS';
const SET_ACTIVE_ACCOUNT = 'accounts/SET_ACTIVE_ACCOUNT';
const FETCHING_ACCOUNT_DATA = 'accounts/FETCHING_ACCOUNT_DATA';
export const UPDATE_ACCOUNT = 'accounts/UPDATE_ACCOUNT';
const ADD_ACCOUNT = 'accounts/ADD_ACCOUNT';
const SET_UNLOCKED_MKR = 'accounts/SET_UNLOCKED_MKR';
export const NO_METAMASK_ACCOUNTS = 'accounts/NO_METAMASK_ACCOUNTS';
const SET_INF_MKR_APPROVAL = 'accounts/SET_INF_MKR_APPROVAL';

const HARDWARE_ACCOUNTS_CONNECTING = 'accounts/HARDWARE_ACCOUNTS_CONNECTING';
const HARDWARE_ACCOUNTS_CONNECTED = 'accounts/HARDWARE_ACCOUNTS_CONNECTED';
const HARDWARE_ACCOUNTS_ERROR = 'accounts/HARDWARE_ACCOUNTS_ERROR';

const HARDWARE_ACCOUNT_CONNECTED = 'accounts/HARDWARE_ACCOUNT_CONNECTED';

// Selectors ----------------------------------------------

export function getAccount(state, address) {
  return state.accounts.allAccounts.find(a => eq(a.address, address));
}

export function getActiveAccount(state) {
  return getAccount(state, state.accounts.activeAccount);
}

export function getActiveVotingFor(state) {
  const activeAccount = getActiveAccount(state);
  if (
    !activeAccount ||
    !activeAccount.hasProxy ||
    !(activeAccount.proxy.votingPower > 0)
  )
    return '';
  return activeAccount.votingFor;
}

export function activeCanVote(state) {
  const activeAccount = getActiveAccount(state);
  return (
    activeAccount &&
    activeAccount.hasProxy &&
    parseFloat(activeAccount.proxy.votingPower) > 0
  );
}

// Actions ------------------------------------------------

export const addAccounts = accounts => async dispatch => {
  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: true });

  for (let account of accounts) {
    const mkrToken = window.maker.getToken(MKR);
    const { hasProxy, voteProxy } = await window.maker
      .service('voteProxy')
      .getVoteProxy(account.address);

    let currProposal = Promise.resolve('');
    if (hasProxy) {
      currProposal = currProposal.then(() =>
        // NOTE for now we just take the first address in the slate since we're
        // assuming that they're only voting for one in the frontend. This
        // should be changed if that changes
        (async () => {
          const addresses = await voteProxy.getVotedProposalAddresses();
          return addresses[0] || '';
        })()
      );
    }
    const _payload = {
      ...account,
      address: account.address,
      mkrBalance: toNum(mkrToken.balanceOf(account.address)),
      hasProxy,
      proxyRole: hasProxy ? voteProxy.getRole() : '',
      votingFor: currProposal,
      proxy: hasProxy
        ? promisedProperties({
            address: voteProxy.getAddress(),
            votingPower: toNum(voteProxy.getNumDeposits()),
            hasInfMkrApproval: mkrToken
              .allowance(account.address, voteProxy.getAddress())
              .then(val => val.eq(MAX_UINT_ETH_BN))
          })
        : { address: '', votingPower: 0, hasInfMkrApproval: false }
    };

    const fetchLinkedAccountData = async () => {
      if (hasProxy) {
        const otherRole = voteProxy.getRole() === 'hot' ? 'cold' : 'hot';
        const linkedAddress = await voteProxy.getLinkedAddress();
        return {
          address: linkedAddress,
          proxyRole: otherRole,
          mkrBalance: await toNum(mkrToken.balanceOf(linkedAddress))
        };
      } else return {};
    };
    const [payload, linkedAccount] = await Promise.all([
      promisedProperties(_payload),
      fetchLinkedAccountData()
    ]);
    payload.proxy.linkedAccount = linkedAccount;
    dispatch({ type: ADD_ACCOUNT, payload });
  }

  dispatch({ type: FETCHING_ACCOUNT_DATA, payload: false });
};

export const addAccount = account => async dispatch => {
  return dispatch(addAccounts([account]));
};

export const removeAccounts = accounts => ({
  type: REMOVE_ACCOUNTS,
  payload: accounts
});

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: account
});

// This is called when an account is selected in the account box dropdown, or
// when Metamask is switched to a different account
export const setActiveAccount = (address, isMetamask) => async (
  dispatch,
  getState
) => {
  // if we haven't seen this account before, fetch its data and add it to the
  // Maker instance
  if (
    isMetamask &&
    !getState().accounts.allAccounts.find(
      a => a.address.toLowerCase() === address.toLowerCase()
    )
  ) {
    await window.maker.addAccount({ type: AccountTypes.METAMASK });
    window.maker.useAccountWithAddress(address);
    await dispatch(addAccount({ address, type: AccountTypes.METAMASK }));
  }
  return dispatch({ type: SET_ACTIVE_ACCOUNT, payload: address });
};

export function setInfMkrApproval() {
  return { type: SET_INF_MKR_APPROVAL };
}

export const connectHardwareAccounts = (
  accountType,
  options = {}
) => dispatch => {
  dispatch({
    type: HARDWARE_ACCOUNTS_CONNECTING
  });

  let path;
  if (accountType === AccountTypes.LEDGER && options.live) {
    path = LEDGER_LIVE_PATH;
  } else if (accountType === AccountTypes.LEDGER && !options.live) {
    path = LEDGER_LEGACY_PATH;
  }

  return new Promise((resolve, reject) => {
    const onChoose = async (addresses, callback) => {
      try {
        const accountsWithType = addresses.map(address => ({
          address,
          type: accountType
        }));

        dispatch({
          type: HARDWARE_ACCOUNTS_CONNECTED,
          payload: {
            accountType,
            accounts: accountsWithType,
            onAccountChosen: callback
          }
        });

        resolve(accountsWithType);
      } catch (err) {
        console.error(err);
        dispatch({
          type: HARDWARE_ACCOUNTS_ERROR
        });
        reject(err);
      }
    };

    window.maker
      .addAccount({
        type: accountType,
        path: path,
        accountsLength: 5,
        choose: onChoose
      })
      .then(account => {
        setActiveAccount(account.address);
        window.maker.useAccountWithAddress(account.address);
      })
      .catch(err => {
        console.error(err);
        dispatch({
          type: HARDWARE_ACCOUNTS_ERROR
        });
        reject(err);
      });
  });
};

export const addHardwareAccount = (address, accountType) => (
  dispatch,
  getState
) => {
  dispatch(
    addAccount({
      address,
      type: accountType
    })
  );

  const {
    accounts: { hardwareAccountsAvailable }
  } = getState();

  // add hardware account to maker object
  hardwareAccountsAvailable[accountType].onChosen(null, address);

  dispatch({
    type: HARDWARE_ACCOUNT_CONNECTED,
    payload: {
      accountType
    }
  });
};

// Reducer ------------------------------------------------

// Reducer helpers
const uniqByAddress = uniqWith((a, b) => a.address === b.address);
const uniqConcat = pipe(
  concat,
  uniqByAddress
);
const addressCmp = (x, y) => x.address === y.address;
const withUpdatedAccount = (accounts, updatedAccount) => {
  return accounts.map(account =>
    account.address === updatedAccount.address &&
    account.type === updatedAccount.type
      ? {
          ...account,
          ...updatedAccount
        }
      : account
  );
};

const fakeColdAccount = {
  address: '0xbeefed1bedded2dabbed3defaced4decade5feed',
  proxyRole: 'cold',
  mkrBalance: 222
};

const fakeHotAccount = {
  id: '_',
  address: '0xbeefed1bedded2dabbed3defaced4decade5dead',
  type: 'fake',
  hasProxy: true,
  proxyRole: 'hot',
  votingFor: '0xbeefed1bedded2dabbed3defaced4decade5feed',
  mkrBalance: 333,
  proxy: {
    address: '0xproxyfake',
    votingPower: 111,
    hasInfMkrApproval: false,
    linkedAccount: fakeColdAccount
  }
};

// eslint-disable-next-line no-unused-vars
const fakeInitialState = {
  activeAccount: fakeHotAccount.address,
  allAccounts: [fakeHotAccount, fakeColdAccount],
  fetching: false
};

// eslint-disable-next-line no-unused-vars
const realInitialState = {
  activeAccount: '',
  fetching: true,
  allAccounts: [],
  hardwareAccountsAvailable: {
    [AccountTypes.TREZOR]: {
      accounts: [],
      onChosen: () => {}
    },
    [AccountTypes.TREZOR]: {
      accounts: [],
      onChosen: () => {}
    }
  }
};

const initialState = realInitialState;

const updateProxyBalance = adding => (state, { payload: amount }) => {
  let account = getActiveAccount({ accounts: state });
  if (!adding) {
    if (typeof amount === 'number') amount = -1 * amount;
    if (typeof amount === 'string') amount = '-' + amount;
  }

  account = {
    ...account,
    mkrBalance: subtract(account.mkrBalance, amount),
    proxy: {
      ...account.proxy,
      linkedAccount: {
        ...account.proxy.linkedAccount,
        mkrBalance:
          account.proxyRole === 'hot'
            ? subtract(account.proxy.linkedAccount.mkrBalance, amount)
            : account.proxy.linkedAccount.mkrBalance
      },
      votingPower: add(account.proxy.votingPower, amount)
    }
  };

  let allAccounts = withUpdatedAccount(state.allAccounts, account);

  let linkedAccount = getAccount(
    { accounts: state },
    account.proxy.linkedAccount.address
  );
  if (linkedAccount) {
    linkedAccount = {
      ...linkedAccount,
      proxy: {
        ...linkedAccount.proxy,
        linkedAccount: {
          ...linkedAccount.proxy.linkedAccount, // TODO: maybe just refresh  account data via fetches, this is slightly confusing
          mkrBalance:
            linkedAccount.proxyRole === 'cold'
              ? subtract(account.mkrBalance, amount)
              : account.mkrBalance
        },
        votingPower: add(linkedAccount.proxy.votingPower, amount)
      }
    };
    allAccounts = withUpdatedAccount(allAccounts, linkedAccount);
  }

  return { ...state, allAccounts };
};

// temporarily commented out until more debugging
// const breakProxyLink = () => state => {
//   let account = getActiveAccount({ accounts: state });
//   let linkedAccountVar = getAccount(
//     { accounts: state },
//     account.proxy.linkedAccount.address
//   );
//   const linkedAccount = account.proxy.linkedAccount;
//   account = {
//     ...account,
//     hasProxy: false,
//     proxyRole: '',
//     proxy: {
//       ...account.proxy,
//       address: '',
//       linkedAccount: {
//         ...account.proxy.linkedAccount,
//         address: '',
//         proxyRole: '',
//         mkrBalance: ''
//       }
//     }
//   };
//   let allAccounts = withUpdatedAccount(state.allAccounts, account);
//   if (linkedAccountVar) {
//     linkedAccountVar = {
//       ...linkedAccountVar,
//       hasProxy: false,
//       proxyRole: '',
//       proxy: {
//         ...linkedAccount.proxy,
//         address: '',
//         linkedAccount: {
//           ...linkedAccountVar.proxy.linkedAccount,
//           address: '',
//           proxyRole: '',
//           mkrBalance: ''
//         }
//       }
//     };
//     allAccounts = withUpdatedAccount(allAccounts, linkedAccountVar);
//   }
//   return { ...state, allAccounts };
// };

const accounts = createReducer(initialState, {
  [REMOVE_ACCOUNTS]: (state, { payload: accounts }) => ({
    ...state,
    allAccounts: differenceWith(addressCmp, state.allAccounts, accounts)
  }),
  [UPDATE_ACCOUNT]: (state, { payload: updatedAccount }) => ({
    ...state,
    allAccounts: withUpdatedAccount(state.allAccounts, updatedAccount)
  }),
  [ADD_ACCOUNT]: (state, { payload: account }) => {
    if (!Object.values(AccountTypes).includes(account.type)) {
      throw new Error(`Unrecognized account type: "${account.type}"`);
    }

    return {
      ...state,
      allAccounts: uniqConcat([account], state.allAccounts),
      activeAccount: account.address
    };
  },
  [SET_ACTIVE_ACCOUNT]: (state, { payload: address }) => ({
    ...state,
    allAccounts: state.allAccounts,
    activeAccount: address
  }),
  [SET_UNLOCKED_MKR]: (state, { payload }) => ({
    ...state,
    activeAccountUnlockedMkr: payload.mkr
  }),
  [FETCHING_ACCOUNT_DATA]: (state, { payload }) => ({
    ...state,
    fetching: payload
  }),
  [NO_METAMASK_ACCOUNTS]: state => ({
    ...state,
    fetching: false
  }),
  [SET_INF_MKR_APPROVAL]: state => {
    const account = getAccount(
      { accounts: state },
      window.maker.currentAddress()
    );
    const updatedAccount = {
      ...account,
      proxy: { ...account.proxy, hasInfMkrApproval: true }
    };
    return {
      ...state,
      allAccounts: withUpdatedAccount(state.allAccounts, updatedAccount)
    };
  },
  [SEND_MKR_TO_PROXY_SUCCESS]: updateProxyBalance(true),
  // [BREAK_LINK_SUCCESS]: breakProxyLink(),
  [WITHDRAW_MKR_SUCCESS]: updateProxyBalance(false),
  [WITHDRAW_ALL_MKR_SUCCESS]: updateProxyBalance(false),
  [INITIATE_LINK_REQUEST]: (state, { payload }) => {
    const hotAccount = {
      ...getAccount({ accounts: state }, payload.hotAddress),
      proxyRole: 'hot'
    };

    const coldAccount = {
      ...getAccount({ accounts: state }, payload.coldAddress),
      proxyRole: 'cold'
    };

    return {
      ...state,
      allAccounts: withUpdatedAccount(
        withUpdatedAccount(state.allAccounts, hotAccount),
        coldAccount
      )
    };
  },
  [HARDWARE_ACCOUNTS_CONNECTING]: state => {
    return state;
  },
  [HARDWARE_ACCOUNTS_CONNECTED]: (state, { payload }) => {
    return {
      ...state,
      hardwareAccountsAvailable: {
        [payload.accountType]: {
          accounts: payload.accounts,
          onChosen: payload.onAccountChosen
        }
      }
    };
  },
  [HARDWARE_ACCOUNTS_ERROR]: state => {
    return state;
  },
  [HARDWARE_ACCOUNT_CONNECTED]: (state, { payload }) => {
    return {
      ...state,
      hardwareAccountsAvailable: {
        [payload.accountType]: {
          accounts: [],
          onChosen: () => {}
        }
      }
    };
  }
  // TODO: right now we're updating account data by refetching via 'postLinkUpdate'
  // but this would be quicker
  // [APPROVE_LINK_SUCCESS]: (state, { payload }) => {
  //   let hotAccount = getAccount({ accounts: state }, payload.hotAddress);
  //   let coldAccount = getAccount({ accounts: state }, payload.coldAddress);

  //   hotAccount = {
  //     ...hotAccount,
  //     proxy: {
  //       ...hotAccount.proxy,
  //       linkedAccount: pick(['address', 'mkrBalance', 'type'], coldAccount)
  //     }
  //   };

  //   coldAccount = {
  //     ...coldAccount,
  //     proxy: {
  //       ...coldAccount.proxy,
  //       linkedAccount: pick(['address', 'mkrBalance', 'type'], hotAccount)
  //     }
  //   };

  //   return {
  //     ...state,
  //     allAccounts: withUpdatedAccount(
  //       withUpdatedAccount(state.allAccounts, hotAccount),
  //       coldAccount
  //     )
  //   };
  // }
});

export default accounts;
