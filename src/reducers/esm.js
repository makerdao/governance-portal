import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

const ESM_STATE_REQUEST = 'esm/ESM_STATE_REQUEST';
const ESM_STATE_SUCCESS = 'esm/ESM_STATE_SUCCESS';
const ESM_STATE_FAILURE = 'esm/ESM_STATE_FAILURE';

// Actions ------------------------------------------------

export const esmInit = () => async dispatch => {
  dispatch({ type: ESM_STATE_REQUEST });
  try {
    const esmService = await window.maker.service('esm');
    const totalStaked = await esmService.getTotalStaked();
    const canFire = await esmService.canFire();
    const thresholdAmount = await esmService.thresholdAmount();
    const fired = await esmService.fired();
    const cageTime = await window.maker
      .service('smartContract')
      .getContract('END')
      .when();
    dispatch({
      type: ESM_STATE_SUCCESS,
      payload: { totalStaked, canFire, thresholdAmount, fired, cageTime }
    });
  } catch (err) {
    dispatch({ type: ESM_STATE_FAILURE });
  }
};

// Reducer ------------------------------------------------

const initialState = {
  fetching: true,
  canFire: false,
  thresholdAmount: 0,
  totalStaked: 0,
  fired: false,
  cageTime: 0
};

const esm = createReducer(initialState, {
  [ESM_STATE_REQUEST]: () => ({
    ...initialState,
    fetching: true
  }),
  [ESM_STATE_SUCCESS]: (_, { payload }) => ({
    ...payload,
    fetching: false
  }),
  [ESM_STATE_FAILURE]: state => ({
    ...state,
    fetching: false
  })
});

export default esm;
