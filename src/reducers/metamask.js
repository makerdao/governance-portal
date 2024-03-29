import mixpanel from 'mixpanel-browser';
import { createReducer } from '../utils/redux';
import { mixpanelIdentify } from '../../src/analytics';
import {
  setActiveAccount,
  addMetamaskAccount,
  NO_METAMASK_ACCOUNTS
} from './accounts';
import { netIdToName } from '../utils/ethereum';
import { ethInit } from './eth';
import { voteTallyInit } from './tally';
import { proposalsInit } from './proposals';
import { pollsInit } from './polling';
import { hatInit } from './hat';
import { esmInit } from './esm';

// Constants ----------------------------------------------

export const UPDATE_ADDRESS = 'metamask/UPDATE_ADDRESS';
export const UPDATE_NETWORK = 'metamask/UPDATE_NETWORK';
export const CONNECT_REQUEST = 'metamask/CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'metamask/CONNECT_SUCCESS';
export const CONNECT_FAILURE = 'metamask/CONNECT_FAILURE';
export const NOT_AVAILABLE = 'metamask/NOT_AVAILABLE';
export const WRONG_NETWORK = 'metamask/WRONG_NETWORK';
export const UPDATE_MAKER = 'metamask/UPDATE_MAKER';

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

export const updateMaker = maker => ({
  type: UPDATE_MAKER,
  payload: { maker }
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
  if (window.ethereum && window.ethereum.selectedAddress) {
    const {
      metamask: { network }
    } = getState();
    const newNetwork = netIdToName(window.ethereum.networkVersion);
    if (newNetwork !== network) {
      // When we remove the reload, we want to remember to update the network.
      // Dispatch kept here to prevent silly errors in the future.
      dispatch(updateNetwork(newNetwork));
      window.location.reload();
    }
  }
};

let triedEnabling = false;

export const initWeb3Accounts = () => async (dispatch, getState) => {
  const {
    metamask: { activeAddress, network },
    accounts: { fetching }
  } = getState();

  async function useAddress() {
    const address = window.ethereum.selectedAddress;
    if (address !== activeAddress) {
      dispatch(updateAddress(address));
      await dispatch(addMetamaskAccount(address));
      await dispatch(setActiveAccount(address, true));
      mixpanelIdentify(address, { wallet: 'metamask' });
      mixpanel.track('account-change', {
        product: 'governance-dashboard',
        account: address,
        network,
        wallet: 'metamask'
      });
    }
  }

  if (window.ethereum && window.ethereum.selectedAddress) {
    await useAddress();
  }
  if (window.ethereum && !triedEnabling) {
    triedEnabling = true;
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await useAddress();
    } catch (err) {
      dispatch({ type: NO_METAMASK_ACCOUNTS });
      dispatch(notAvailable());
    }
  } else if (fetching && !activeAddress) {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch(notAvailable());
  }
};

export const init = (maker, network = 'mainnet') => async dispatch => {
  dispatch(connectRequest());

  if (!window.ethereum || !window.ethereum.selectedAddress) {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch(notAvailable());
  }
  dispatch(connectSuccess(network));
  dispatch(updateNetwork(network));
  dispatch(updateMaker(maker));
  setTimeout(() => dispatch(voteTallyInit()), 3000);
  dispatch(proposalsInit(network));
  dispatch(hatInit());
  dispatch(ethInit());
  dispatch(pollsInit());
  setTimeout(() => dispatch(esmInit()), 5000);
  await dispatch(initWeb3Accounts());
  dispatch(pollForMetamaskChanges());
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  activeAddress: '',
  available: false,
  network: 'mainnet',
  wrongNetwork: false,
  maker: {}
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
  }),
  [UPDATE_MAKER]: (state, { payload: maker }) => ({
    ...state,
    maker: maker
  })
});

export default metamask;
