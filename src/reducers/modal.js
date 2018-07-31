import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

const MODAL_OPEN = 'modal/MODAL_OPEN';
const MODAL_CLOSE = 'modal/MODAL_CLOSE';
const CLEAR = 'modal/CLEAR';

// Actions ------------------------------------------------

let timeout;

export const modalOpen = (modal, props = {}) => {
  clearTimeout(timeout);
  return {
    type: MODAL_OPEN,
    payload: { modal, props }
  };
};

export const modalClose = () => dispatch => {
  dispatch({ type: MODAL_CLOSE });
  timeout = setTimeout(() => dispatch({ type: CLEAR }), 250);
};

// Reducer ------------------------------------------------

const initialState = {
  modal: () => null,
  open: false,
  modalProps: {}
};

const modal = createReducer(initialState, {
  [MODAL_OPEN]: (state, { payload }) => ({
    ...state,
    open: true,
    modal: payload.modal,
    modalProps: payload.props
  }),
  [MODAL_CLOSE]: state => ({ ...state, open: false }),
  [CLEAR]: () => ({ ...initialState })
});

export default modal;
