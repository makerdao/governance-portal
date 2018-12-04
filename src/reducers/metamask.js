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

const pollForMetamaskChanges = maker => async dispatch => {
  try {
    // TODO: need to account for MM logout
    await dispatch(initWeb3Accounts());

    setTimeout(() => dispatch(pollForMetamaskChanges(maker)), 1000);
  } catch (err) {
    console.error(err);
    console.error('stopped polling for metamask changes');
  }
};

const initWeb3Accounts = () => async (dispatch, getState) => {
  const {
    metamask: { network, activeAddress },
    accounts: { fetching }
  } = getState();
  if (window.web3 && window.web3.eth.defaultAccount) {
    const address = window.web3.eth.defaultAccount;
    if (address !== activeAddress) {
      dispatch(updateAddress(address));
      await dispatch(setActiveAccount(address, true));
      // dispatch({ type: CONNECT_SUCCESS, payload: { network } });
    } else if (fetching && !activeAddress) {
      dispatch({ type: NO_METAMASK_ACCOUNTS });
      dispatch({ type: NOT_AVAILABLE });
    }
  }
};

export const init = (maker, network = 'mainnet') => async dispatch => {
  console.log('initialize with network', network);
  dispatch({ type: CONNECT_REQUEST });
  dispatch({ type: CONNECT_SUCCESS, payload: { network } });

  if (!window.web3 || !window.web3.eth.defaultAccount) {
    console.log('not connected to MetaMask');
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch({ type: NOT_AVAILABLE });
  }
  if (network !== 'mainnet' && network !== 'kovan') {
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    return dispatch({ type: WRONG_NETWORK });
  }
  dispatch(pollForMetamaskChanges(maker));
  // dispatch(initializeOtherStuff(network));
  dispatch(voteTallyInit());
  dispatch(proposalsInit(network));
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
