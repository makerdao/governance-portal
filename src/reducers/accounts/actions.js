import { AccountTypes } from '../../utils/constants';
import { eq, toNum, promisedProperties } from '../../utils/misc';
import { MAX_UINT_ETH_BN } from '../../utils/ethereum';
import { MKR } from '../../chain/maker';
import {
  REMOVE_ACCOUNTS,
  SET_ACTIVE_ACCOUNT,
  FETCHING_ACCOUNT_DATA,
  UPDATE_ACCOUNT,
  ADD_ACCOUNT,
  SET_INF_MKR_APPROVAL
} from './constants';

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
