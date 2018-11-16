import uniqWith from 'ramda/src/uniqWith';
import concat from 'ramda/src/concat';
import pipe from 'ramda/src/pipe';
import differenceWith from 'ramda/src/differenceWith';

import { createReducer } from '../../utils/redux';
import { AccountTypes } from '../../utils/constants';
import { add, subtract } from '../../utils/misc';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS,
  WITHDRAW_ALL_MKR_SUCCESS,
  INITIATE_LINK_REQUEST
} from '../proxy';
import { getActiveAccount, getAccount } from './actions';
import {
  REMOVE_ACCOUNTS,
  SET_ACTIVE_ACCOUNT,
  FETCHING_ACCOUNT_DATA,
  UPDATE_ACCOUNT,
  ADD_ACCOUNT,
  SET_UNLOCKED_MKR,
  NO_METAMASK_ACCOUNTS,
  SET_INF_MKR_APPROVAL
} from './constants';

// Reducer ------------------------------------------------

// Reducer helpers
const uniqByAddress = uniqWith((a, b) => a.address === b.address);
const uniqConcat = pipe(
  concat,
  uniqByAddress
);
const addressCmp = (x, y) => x.address === y.address;
const withUpdatedAccount = (accounts, updatedAccount) => {
  return accounts.map(
    account =>
      account.address === updatedAccount.address &&
      account.type === updatedAccount.type
        ? {
            ...account,
            ...updatedAccount
          }
        : account
  );
};

export const fakeAccount = {
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
    linkedAccount: {
      address: '0xbeefed1bedded2dabbed3defaced4decade5feed',
      proxyRole: 'cold',
      mkrBalance: 222
    }
  }
};

const initialState = {
  activeAccount: '',
  fetching: true,
  // activeAccount: '0xbeefed1bedded2dabbed3defaced4decade5dead', // just for dev
  allAccounts: [
    // fakeAccount
  ]
};

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
