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
  console.log('update network called with', network);
  // const web3Service = window.maker.service('web3');
  if (network !== 'mainnet' && network !== 'kovan') {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    return dispatch({ type: WRONG_NETWORK });
  }
  dispatch({ type: CONNECT_SUCCESS, payload: { network } });

  // const setProvider = await web3Service._web3.setProvider(netToUri(network));
  // await window.web3.setProvider(netToUri(network));
  await window.maker
    .service('web3')
    ._web3.setProvider('https://kovan.infura.io/');
  console.log('setProvider network used', network);
  // dispatch(initializeOtherStuff(network));
};

const pollForMetamaskChanges = maker => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();
  try {
    if (window.web3 && window.web3.eth.defaultAccount) {
      const address = window.web3.eth.defaultAccount;
      if (address !== activeAddress) {
        dispatch(updateAddress(address));
        await dispatch(setActiveAccount(address, true));
        dispatch({ type: CONNECT_SUCCESS, payload: { network } });
        dispatch(initializeOtherStuff(network));
      } else if (fetching && !activeAddress) {
        dispatch({ type: NO_METAMASK_ACCOUNTS });
        dispatch({ type: NOT_AVAILABLE });
      }
    }

    setTimeout(() => dispatch(pollForMetamaskChanges(maker)), 1000);
  } catch (err) {
    console.error(err);
    console.error('stopped polling for metamask changes');
  }
};

const initializeOtherStuff = network => async dispatch => {
  dispatch(voteTallyInit());
  dispatch(proposalsInit(network));
  dispatch(hatInit());
  dispatch(ethInit());
};

export const init = maker => async dispatch => {
  // network is always mainnet since we create maker that way
  let network = 'mainnet';

  if (!window.web3 || !window.web3.eth.defaultAccount) {
    console.log('not connected to MetaMask');
    // we don't have MM, so load read only stuff
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    /**
     * TODO: remember to check for wrong network
     */
  } else {
    console.log('Connected to MetaMask');
    // we do have metamask, so load load provider and accounts
    // first check metamask for network, if its not mainnet, we'll update it here:
    await dispatch(getNetworkNameFromMetaMask());
    // meanwhile load up accounts for mainnet (current network)
    try {
      // await dispatch(initWeb3Accounts());
    } catch (err) {
      console.log('update accounts error in MM', err);
    }
  }
  // dispatch(pollForMetamaskChanges(maker));
  dispatch(initializeOtherStuff(network));
};

const initWeb3Accounts = () => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();

  console.log('network', network);
  console.log('fetching', fetching);
  console.log('activeAddress', activeAddress);
  if (window.web3 && window.web3.eth.defaultAccount) {
    const address = window.web3.eth.defaultAccount;
    if (address !== activeAddress) {
      // ostensibly now that we're using MM for sure,
      // we need to set the provider via MM, even if it has
      // already been set by our web3service...
      // await window.web3.setProvider(netToUri(network));
      console.log(
        'network should be newest updated network (kovan for now)',
        network
      );
      dispatch(updateAddress(address));
      await dispatch(setActiveAccount(address, true));
      dispatch({ type: CONNECT_SUCCESS, payload: { network } });
    } else if (fetching && !activeAddress) {
      dispatch({ type: NO_METAMASK_ACCOUNTS });
      dispatch({ type: NOT_AVAILABLE });
    }
    dispatch(initializeOtherStuff(network));
  }
};

// TODO: move this step into index and set the network there before creating maker
const getNetworkNameFromMetaMask = () => async (dispatch, getState) => {
  const { network } = getState();
  await window.web3.version.getNetwork(async (err, netId) => {
    const metaMaskNetworkName = netIdToName(netId);
    console.log('metaMaskNetworkName', metaMaskNetworkName);
    if (metaMaskNetworkName !== network) {
      await dispatch(updateNetwork(metaMaskNetworkName));
      await dispatch(initWeb3Accounts());
    }
  });
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
