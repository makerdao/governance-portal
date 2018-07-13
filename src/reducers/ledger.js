import { createReducer } from "../utils/redux";
import { addAccounts } from "./accounts";
import ledgerSubprovider from "../chain/ledger";

// Constants ----------------------------------------------

const CONNECT_REQUEST = "ledger/CONNECT_REQUEST";
const CONNECT_SUCCESS = "ledger/CONNECT_SUCCESS";
const CONNECT_FAILURE = "ledger/CONNECT_FAILURE";

// Actions ------------------------------------------------

export const ledgerConnectInit = () => dispatch => {
  dispatch({ type: CONNECT_REQUEST });
  ledgerSubprovider.getAccounts((error, addresses) => {
    if (!error) {
      dispatch({ type: CONNECT_SUCCESS, payload: { addresses } });
      const accounts = addresses.map(address => ({ address, type: "LEDGER" }));
      dispatch(addAccounts(accounts));
    } else dispatch({ type: CONNECT_FAILURE });
    // maybe notify if ledger is supposed to be used, but we can't get it
  });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  addresses: ""
};

const metamask = createReducer(initialState, {
  [CONNECT_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [CONNECT_SUCCESS]: (state, { payload }) => ({
    ...state,
    addresses: payload.addresses,
    fetching: false
  }),
  [CONNECT_FAILURE]: () => ({
    addresses: "",
    web3Available: false
  })
});

export default metamask;
