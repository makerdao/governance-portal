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
  // last console (kovan) before AccountsService and crash
  console.log('network in update network', network);
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
  console.log('state on latest MM poll', getState());
  try {
    const newNetwork = netIdToName(maker.service('web3').networkId());

    // all the data in the store could be wrong now. in later versions we could
    // clear out any network-specific data from the store carefully, but for now
    // the simplest thing is to start over from scratch.
    if (newNetwork !== network) {
      console.log('new', newNetwork, 'orig', network);
      return window.location.reload();
    }

    // check account again
    if (window.web3 && window.web3.eth.defaultAccount) {
      let mmNet;
      await window.web3.version.getNetwork(async (err, netId) => {
        console.log('netId', netId);
        mmNet = netId;
        console.log('mmNet', mmNet);

        const mmNetName = netIdToName(mmNet);
        console.log('mmNetName', mmNetName);

        if (mmNetName !== network) await dispatch(updateNetwork(mmNetName));
        // await dispatch(updateNetwork(mmNetName));
      });

      // first thing after logging into MM
      const address = window.web3.eth.defaultAccount;
      console.log('address in polling', address);
      console.log('are we fetching?', fetching);

      if (address && address !== activeAddress) {
        console.log('you shouldnt see this unless this has a value:', address);
        // const addAcctResult = await maker
        //   .service('accounts')
        //   .addAccount(address, { type: 'browser' });

        // console.log('addAcctResult', addAcctResult);
        dispatch(updateAddress(address));
        await dispatch(setActiveAccount(address, true));
      } else if (fetching && !activeAddress) {
        console.log('dispatch no MM accounts');
        dispatch({ type: NO_METAMASK_ACCOUNTS });
        dispatch({ type: NOT_AVAILABLE });
      }
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
  // window.web3.eth.accounts causes exception?
  // this checks if MM is connected:
  if (!window.web3 || !window.web3.eth.defaultAccount) {
    console.log('no default account');
    // should probably dispatch no metamask accounts
    dispatch({ type: NO_METAMASK_ACCOUNTS });
    dispatch({ type: NOT_AVAILABLE });
    dispatch(pollForMetamaskChanges(maker));
    // also skip down to bottom
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
