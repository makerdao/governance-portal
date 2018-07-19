import { createReducer } from '../utils/redux';
import { addAccount } from './accounts';
import { createSubProvider } from '../chain/hw-wallet';
import { netNameToId } from '../utils/ethereum';
import uniq from 'ramda/src/uniq';
import values from 'ramda/src/values';

// Constants ----------------------------------------------

const CONNECT_REQUEST = 'trezor/CONNECT_REQUEST';
const CONNECT_SUCCESS = 'trezor/CONNECT_SUCCESS';
const CONNECT_FAILURE = 'trezor/CONNECT_FAILURE';

// Actions ------------------------------------------------

export const trezorConnectInit = () => (dispatch, getState) => {
  dispatch({ type: CONNECT_REQUEST });
  const trezor = createSubProvider('trezor', {
    networkId: netNameToId(getState().metamask.network),
    promisify: true
  });
  return trezor
    .getAccounts()
    .then(addressesMap => {
      const address = values(addressesMap)[0];
      dispatch({ type: CONNECT_SUCCESS, payload: address });
      return dispatch(addAccount({ address, type: 'TREZOR' }));
    })
    .catch(err => {
      // maybe notify if trezor is supposed to be used, but we can't get it
      dispatch({ type: CONNECT_FAILURE, payload: err });
    });
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  addresses: []
};

export default createReducer(initialState, {
  [CONNECT_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [CONNECT_SUCCESS]: (state, { payload }) => ({
    ...state,
    addresses: uniq(state.addresses.concat(payload)),
    fetching: false
  })
});
