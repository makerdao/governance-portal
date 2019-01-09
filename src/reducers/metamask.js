import { createReducer } from '../utils/redux';
import { setActiveAccount, NO_METAMASK_ACCOUNTS } from './accounts';
import { netIdToName, netToUri } from '../utils/ethereum';
import { ethInit } from './eth';
import { voteTallyInit } from './tally';
import { proposalsInit } from './proposals';
import { hatInit } from './hat';

// Constants ----------------------------------------------

export const UPDATE_ADDRESS = 'metamask/UPDATE_ADDRESS';
export const UPDATE_NETWORK = 'metamask/UPDATE_NETWORK';
export const CONNECT_REQUEST = 'metamask/CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'metamask/CONNECT_SUCCESS';
export const CONNECT_FAILURE = 'metamask/CONNECT_FAILURE';
export const NOT_AVAILABLE = 'metamask/NOT_AVAILABLE';
export const WRONG_NETWORK = 'metamask/WRONG_NETWORK';

// Actions ------------------------------------------------

export const updateAddress = address => ({
  type: UPDATE_ADDRESS,
  payload: address
});

export const connectRequest = () => ({
  type: CONNECT_REQUEST
});

export const connectSuccess = network => ({
  type: CONNECT_SUCCESS,
  payload: { network }
});

export const updateNetwork = network => ({
  type: UPDATE_NETWORK,
  payload: { network: network }
});

export const notAvailable = () => ({
  type: NOT_AVAILABLE
});

export const wrongNetwork = () => ({
  type: WRONG_NETWORK
});

export const pollForMetamaskChanges = () => async dispatch => {
  try {
    await dispatch(initWeb3Accounts());
    await dispatch(checkNetwork());

    setTimeout(() => dispatch(pollForMetamaskChanges()), 1000);
  } catch (err) {
    console.error(err);
  }
};

export const checkNetwork = () => async (dispatch, getState) => {
  if (window.web3 && window.web3.eth.defaultAccount) {
    window.web3.version.getNetwork(async (err, netId) => {
      const {
        metamask: { network }
      } = getState();
      const newNetwork = netIdToName(netId);
      if (newNetwork !== network) {
        dispatch(updateNetwork(newNetwork));
        window.maker.service('web3')._web3.setProvider(netToUri(newNetwork));
      }
    });
  }
};

export const initWeb3Accounts = () => async (dispatch, getState) => {
  const {
    metamask: { activeAddress },
    accounts: { fetching }
  } = getState();
  if (window.web3 && window.web3.eth.defaultAccount) {
    const address = window.web3.eth.defaultAccount;
    if (address !== activeAddress) {
      dispatch(updateAddress(address));
      await dispatch(setActiveAccount(address, true));
    }
  } else if (fetching && !activeAddress) {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch(notAvailable());
  }
};

export const init = (network = 'mainnet') => async dispatch => {
  dispatch(connectRequest());

  if (!window.web3 || !window.web3.eth.defaultAccount) {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch(notAvailable());
  }
  dispatch(connectSuccess(network));
  dispatch(updateNetwork(network));

  window.maker.service('web3')._web3.setProvider(netToUri(network));
  await dispatch(initWeb3Accounts());

  dispatch(voteTallyInit());
  dispatch(proposalsInit(network));
  dispatch(hatInit());
  dispatch(ethInit());
  dispatch(pollForMetamaskChanges());
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
  [UPDATE_NETWORK]: (state, { payload }) => ({
    ...state,
    network: payload.network,
    wrongNetwork: false
  }),
  [WRONG_NETWORK]: state => ({
    ...state,
    wrongNetwork: true
  })
});

export default metamask;
