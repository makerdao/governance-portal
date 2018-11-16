import { createReducer } from '../utils/redux';
import { setActiveAccount } from './accounts/actions';
import { NO_METAMASK_ACCOUNTS } from './accounts/constants';
import { netIdToName, netToUri } from '../utils/ethereum';
import { ethInit } from './eth';
import { voteTallyInit } from './tally';
import { topicsInit } from './topics';
import { hatInit } from './hat';

// Constants ----------------------------------------------

const UPDATE_ADDRESS = 'metamask/UPDATE_ADDRESS';
const UPDATE_NETWORK = 'metamask/UPDATE_NETWORK';
const CONNECT_REQUEST = 'metamask/CONNECT_REQUEST';
const CONNECT_SUCCESS = 'metamask/CONNECT_SUCCESS';
const CONNECT_FAILURE = 'metamask/CONNECT_FAILURE';
const NOT_AVAILABLE = 'metamask/NOT_AVAILABLE';
const WRONG_NETWORK = 'metamask/WRONG_NETWORK';

// Actions ------------------------------------------------

export const updateAddress = address => ({
  type: UPDATE_ADDRESS,
  payload: address
});

const pollForMetamaskChanges = maker => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();
  try {
    const newNetwork = netIdToName(maker.service('web3').networkId());
    // all the data in the store could be wrong now. in later versions we could
    // clear out any network-specific data from the store carefully, but for now
    // the simplest thing is to start over from scratch.
    if (newNetwork !== network) return window.location.reload();

    const address = window.web3.eth.defaultAccount;
    if (address && address !== activeAddress) {
      dispatch(updateAddress(address));
      await dispatch(setActiveAccount(address, true));
    } else if (fetching && !activeAddress) {
      dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
    }
    setTimeout(() => dispatch(pollForMetamaskChanges(maker)), 1000);
  } catch (err) {
    console.error(err);
    console.error('stopped polling for metamask changes');
  }
};

export const init = maker => async dispatch => {
  dispatch({ type: CONNECT_REQUEST });

  // we default to mainnet so that if Metamask is unavailable, the user can at
  // least read the list of proposals
  let network = 'mainnet';
  let networkIsSet = false;

  const web3Service = maker.service('web3');

  try {
    network = netIdToName(web3Service.networkId());
    if (network !== 'mainnet' && network !== 'kovan') {
      dispatch({ type: NO_METAMASK_ACCOUNTS });
      return dispatch({ type: WRONG_NETWORK });
    }
    dispatch({ type: CONNECT_SUCCESS, payload: { network } });
    web3Service._web3.setProvider(netToUri(network));
    networkIsSet = true;

    // don't await this, so that account lookup and voting data can occur in
    // parallel
    dispatch(pollForMetamaskChanges(maker));
  } catch (error) {
    // TODO: notify user or throw to a fallback component
    console.error(error);
    dispatch({ type: CONNECT_FAILURE });
    dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
  }

  // TODO handle failure
  // dispatch({ type: NOT_AVAILABLE });
  // dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer

  if (!networkIsSet) web3Service._web3.setProvider(netToUri(network));
  dispatch(voteTallyInit());
  dispatch(topicsInit(network));
  dispatch(hatInit());
  dispatch(ethInit());
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  activeAddress: '',
  available: false,
  network: 'mainnet',
  wrongNetwork: false
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
    network: payload.network,
    wrongNetwork: false
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
  [UPDATE_ADDRESS]: (state, { payload: address }) => ({
    ...state,
    activeAddress: address
  }),
  [UPDATE_NETWORK]: (state, { payload: network }) => ({
    ...state,
    network,
    wrongNetwork: false
  }),
  [WRONG_NETWORK]: state => ({
    ...state,
    wrongNetwork: true
  })
});

export default metamask;
