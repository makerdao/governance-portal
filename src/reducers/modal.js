import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

const MODAL_OPEN = 'modal/MODAL_OPEN';
const MODAL_CLOSE = 'modal/MODAL_CLOSE';

// Actions ------------------------------------------------

export const modalOpen = (modal, props = {}) => ({
  type: MODAL_OPEN,
  payload: { name: modal, props }
});

export const modalClose = () => ({ type: MODAL_CLOSE });

// Reducer ------------------------------------------------

const initialState = {
  modal: '',
  modalProps: {}
};

const modal = createReducer(initialState, {
  [MODAL_OPEN]: (state, { payload }) => ({
    ...state,
    modal: payload.name,
    modalProps: payload.props
  }),
  [MODAL_CLOSE]: state => ({ ...state, modal: '', modalProps: {} })
});

export default modal;
