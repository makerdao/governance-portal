import { createReducer } from '../utils/redux';
import { addAccounts } from './accounts';
import { createSubProvider, LEDGER } from '../chain/hw-wallet';
import { netNameToId } from '../utils/ethereum';

// Constants ----------------------------------------------

const CONNECT_REQUEST = 'ledger/CONNECT_REQUEST';
const CONNECT_SUCCESS = 'ledger/CONNECT_SUCCESS';
const CONNECT_FAILURE = 'ledger/CONNECT_FAILURE';

// Actions ------------------------------------------------

export const ledgerConnectInit = () => (dispatch, getState) => {
  dispatch({ type: CONNECT_REQUEST });
  const ledger = createSubProvider(LEDGER, {
    networkId: netNameToId(getState().metamask.network),
    promisify: true
  });

  ledger
    .getAccounts()
    .then(addresses => {
      dispatch({ type: CONNECT_SUCCESS, payload: { addresses } });
      const accounts = addresses.map(address => ({
        address,
        type: 'LEDGER',
        subprovider: ledger
      }));
      dispatch(addAccounts(accounts));
    })
    .catch(() => {
      // maybe notify if ledger is supposed to be used, but we can't get it
      dispatch({ type: CONNECT_FAILURE });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  addresses: ''
};

const ledger = createReducer(initialState, {
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
    addresses: '',
    web3Available: false
  })
});

export default ledger;
