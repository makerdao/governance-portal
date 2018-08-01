import { createReducer } from '../utils/redux';
import { getEthPrice } from '../chain/read';

// Constants ----------------------------------------------

const ETH_PRICE_REQUEST = 'eth/ETH_PRICE_REQUEST';
const ETH_PRICE_SUCCESS = 'eth/ETH_PRICE_SUCCESS';
const ETH_PRICE_FAILURE = 'eth/ETH_PRICE_FAILURE';

// Actions ------------------------------------------------

export const ethPriceInit = () => async dispatch => {
  try {
    dispatch({ type: ETH_PRICE_REQUEST });
    const ethPrice = await getEthPrice();
    dispatch({ type: ETH_PRICE_SUCCESS, payload: { ethPrice } });
  } catch (err) {
    dispatch({ type: ETH_PRICE_FAILURE });
  }
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: false,
  ethPrice: ''
};

const eth = createReducer(initialState, {
  [ETH_PRICE_REQUEST]: state => ({
    ...state,
    fetching: true
  }),
  [ETH_PRICE_SUCCESS]: (state, { payload }) => ({
    ...state,
    ethPrice: payload.ethPrice
  }),
  [ETH_PRICE_FAILURE]: () => ({
    ...initialState
  })
});

export default eth;
