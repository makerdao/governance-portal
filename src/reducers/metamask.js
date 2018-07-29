import { createReducer } from '../utils/redux';
import { getMetamaskNetworkName, setWeb3Network } from '../chain/web3';
import { addAccount, setActiveAccount } from './accounts';
import { voteTallyInit } from './tally';
import { topicsInit } from './topics';
import { hatInit } from './hat';
import { NO_METAMASK_ACCOUNTS } from './accounts';

// Constants ----------------------------------------------

const UPDATE_ACCOUNT = 'metamask/UPDATE_ACCOUNT';
const UPDATE_NETWORK = 'metamask/UPDATE_NETWORK';
const CONNECT_REQUEST = 'metamask/CONNECT_REQUEST';
const CONNECT_SUCCESS = 'metamask/CONNECT_SUCCESS';
const CONNECT_FAILURE = 'metamask/CONNECT_FAILURE';
const NOT_AVAILABLE = 'metamask/NOT_AVAILABLE';

// Actions ------------------------------------------------

const pollForMetamaskChanges = () => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();
  const newNetwork = await getMetamaskNetworkName();
  // all the data in the store could be wrong now. later on we could clear out
  // any network-specific data from the store carefully, but for now the
  // simplest thing is to start over from scratch.
  if (newNetwork !== network) return window.location.reload();

  const address = window.web3.eth.defaultAccount;
  if (address !== undefined && address !== activeAddress) {
    dispatch({ type: UPDATE_ACCOUNT, payload: address });
    await dispatch(addAccount({ address, type: 'METAMASK' }));
    dispatch(setActiveAccount(address));
  } else if (fetching) {
    dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
  }
  setTimeout(() => dispatch(pollForMetamaskChanges()), 2000);
};

export const metamaskConnectInit = () => async dispatch => {
  dispatch({ type: CONNECT_REQUEST });

  // we default to mainnet so that if Metamask is unavailable, the user can at
  // least read the list of proposals
  let network = 'mainnet';
  let networkIsSet = false;

  if (typeof window.web3 !== 'undefined') {
    try {
      network = await getMetamaskNetworkName();
      dispatch({ type: CONNECT_SUCCESS, payload: { network } });
      setWeb3Network(network);
      networkIsSet = true;

      // don't await this, so that account lookup and voting data can occur in
      // parallel
      dispatch(pollForMetamaskChanges());
    } catch (error) {
      // TODO: notify user or throw to a fallback component
      console.error(error);
      dispatch({ type: CONNECT_FAILURE });
      dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
    }
  } else {
    dispatch({ type: NOT_AVAILABLE });
    dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
  }

  if (!networkIsSet) setWeb3Network(network);
  dispatch(voteTallyInit());
  dispatch(topicsInit(network));
  dispatch(hatInit());
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  activeAddress: '',
  available: false,
  network: 'mainnet'
};

const metamask = createReducer(initialState, {
  [CONNECT_REQUEST]: state => ({
    ...state,
    fetching: true,
    available: false
  }),
  [CONNECT_SUCCESS]: (state, { payload }) => ({
    ...state,
    fetching: false,
    available: true,
    network: payload.network
  }),
  [CONNECT_FAILURE]: () => ({
    ...initialState,
    fetching: false,
    available: true
  }),
  [NOT_AVAILABLE]: () => ({
    ...initialState,
    fetching: false
  }),
  [UPDATE_ACCOUNT]: (state, { payload: address }) => ({
    ...state,
    activeAddress: address
  }),
  [UPDATE_NETWORK]: (state, { payload: network }) => ({
    ...state,
    network
  })
});

export default metamask;
