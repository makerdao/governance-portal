import { createReducer } from '../utils/redux';
import maker from '../chain/maker';

// Constants ----------------------------------------------

const ETH_INFO_REQUEST = 'eth/ETH_INFO_REQUEST';
const ETH_INFO_SUCCESS = 'eth/ETH_INFO_SUCCESS';
const ETH_INFO_FAILURE = 'eth/ETH_INFO_FAILURE';

// Actions ------------------------------------------------

export const ethInit = () => async dispatch => {
  try {
    dispatch({ type: ETH_INFO_REQUEST });
    const price = await maker.service('price').getEthPrice();
    const gasCost = await maker.getGasPriceEstimate();
    dispatch({ type: ETH_INFO_SUCCESS, payload: { price, gasCost } });
  } catch (err) {
    dispatch({ type: ETH_INFO_FAILURE });
  }
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  gasCost: '',
  price: ''
};

const eth = createReducer(initialState, {
  [ETH_INFO_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [ETH_INFO_SUCCESS]: (state, { payload }) => ({
    ...state,
    gasCost: payload.gasCost,
    price: payload.price
  }),
  [ETH_INFO_FAILURE]: () => ({
    ...initialState
  })
});

export default eth;
