import { createReducer } from '../utils/redux';
import { setActiveAccount, addAccount, NO_METAMASK_ACCOUNTS } from './accounts';
import { netIdToName, netToUri } from '../utils/ethereum';
import { ethInit } from './eth';
import { voteTallyInit } from './tally';
import { proposalsInit } from './proposals';
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

const updateNetwork = network => async dispatch => {
  const web3Service = window.maker.service('web3');
  if (network !== 'mainnet' && network !== 'kovan') {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    return dispatch({ type: WRONG_NETWORK });
  }
  dispatch({ type: CONNECT_SUCCESS, payload: { network } });
  await web3Service._web3.setProvider(netToUri(network));
};

const pollForMetamaskChanges = maker => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();
  console.log('fetching & active address before', fetching, activeAddress);
  try {
    // check if we have metamask
    if (window.web3 && window.web3.eth.defaultAccount) {
      const newNetwork = netIdToName(maker.service('web3').networkId());
      // all the data in the store could be wrong now. in later versions we could
      // clear out any network-specific data from the store carefully, but for now
      // the simplest thing is to start over from scratch.
      if (newNetwork !== network) {
        console.log('new', newNetwork, 'orig', network);
        return window.location.reload();
      }

      // await window.web3.version.getNetwork(async (err, netId) => {
      // console.log('netId', netId);
      // when should we set the provider?
      // await window.maker.service('web3')._web3.setProvider(netToUri(network));
      // this could be simplified:
      const address = window.web3.eth.defaultAccount;
      if (address && address !== activeAddress) {
        dispatch(updateAddress(address));
        await dispatch(setActiveAccount(address, true));
        console.log('fetching & active address after', fetching, activeAddress);
      } else if (fetching && !activeAddress) {
        dispatch({ type: NO_METAMASK_ACCOUNTS });
        dispatch({ type: NOT_AVAILABLE });
      }
      // });
    }
    // end check

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
  let network = 'mainnet'; // this is now already set by create
  let networkIsSet = false;

  const web3Service = maker.service('web3');
  // this checks if MM is connected:
  if (!window.web3 || !window.web3.eth.defaultAccount) {
    console.log('not connected to MetaMask');
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch({ type: NOT_AVAILABLE });
    dispatch(pollForMetamaskChanges(maker));
  } else {
    try {
      network = netIdToName(web3Service.networkId());
      dispatch(updateNetwork(network));
      networkIsSet = true;

      // don't await this, so that account lookup and voting data can occur in
      // parallel
      dispatch(pollForMetamaskChanges(maker));
    } catch (error) {
      // TODO: notify user or throw to a fallback component
      dispatch({ type: CONNECT_FAILURE });
      dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer
    }
  }

  // TODO handle failure
  // dispatch({ type: NOT_AVAILABLE });
  // dispatch({ type: NO_METAMASK_ACCOUNTS }); // accounts reducer

  if (!networkIsSet) web3Service._web3.setProvider(netToUri(network));
  dispatch(voteTallyInit());
  dispatch(proposalsInit(network)); // this doesn't return anything because no account err
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
