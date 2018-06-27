import { createReducer } from "../helpers/redux";
import { getMetamaskNetworkName } from "../handlers/web3";

// Constants

const UPDATE_ACCOUNT = "metamask/UPDATE_ACCOUNT";
const UPDATE_NETWORK = "metamask/UPDATE_NETWORK";
const CONNECT_REQUEST = "metamask/CONNECT_REQUEST";
const CONNECT_SUCCESS = "metamask/CONNECT_SUCCESS";
const CONNECT_FAILURE = "metamask/CONNECT_FAILURE";
const NOT_AVAILABLE = "metamask/NOT_AVAILABLE";

// Actions

let accountTimeout = null;
let networkTimeout = null;

export const updateMetamaskAccount = () => (dispatch, getState) => {
  if (window.web3.eth.defaultAccount !== getState().metamask.accountAddress) {
    const accountAddress = window.web3.eth.defaultAccount;
    dispatch({
      type: UPDATE_ACCOUNT,
      payload: { address: accountAddress }
    });
  }
  accountTimeout = setTimeout(() => dispatch(updateMetamaskAccount()), 100);
};

export const updateMetamaskNetwork = () => (dispatch, getState) => {
  getMetamaskNetworkName()
    .then(network => {
      if (network !== getState().metamask.network) {
        dispatch({ type: UPDATE_NETWORK, payload: { network } });
      }
      networkTimeout = setTimeout(() => dispatch(updateMetamaskNetwork()), 250);
    })
    .catch(error => {
      console.error(error);
      dispatch({ type: CONNECT_FAILURE });
    });
};

export const metamaskConnectInit = () => dispatch => {
  dispatch({ type: CONNECT_REQUEST });
  if (typeof window.web3 !== "undefined") {
    getMetamaskNetworkName()
      .then(network => {
        dispatch({ type: CONNECT_SUCCESS, payload: { network } });
        dispatch(updateMetamaskAccount());
        dispatch(updateMetamaskNetwork());
      })
      .catch(error => {
        // TODO: notify user or throw to a fallback component
        console.error(error);
        dispatch({ type: CONNECT_FAILURE });
      });
  } else {
    dispatch({ type: NOT_AVAILABLE });
  }
};

export const metamaskClearTimeouts = () => () => {
  clearTimeout(accountTimeout);
  clearTimeout(networkTimeout);
};

// Reducer

const initialState = {
  fetching: false,
  accountAddress: "",
  web3Available: false,
  network: "main"
};

const metamask = createReducer(initialState, {
  [CONNECT_REQUEST]: state => ({
    ...state,
    fetching: true,
    web3Available: false
  }),
  [CONNECT_SUCCESS]: (state, { payload }) => ({
    ...state,
    fetching: false,
    web3Available: true,
    network: payload.network
  }),
  [CONNECT_FAILURE]: state => ({
    ...state,
    fetching: false,
    web3Available: true
  }),
  [NOT_AVAILABLE]: state => ({
    ...state,
    fetching: false,
    web3Available: false
  }),
  [UPDATE_ACCOUNT]: (state, { payload }) => ({
    ...state,
    accountAddress: payload.address
  }),
  [UPDATE_NETWORK]: (state, { payload }) => ({
    ...state,
    network: payload.network
  })
});

export default metamask;
