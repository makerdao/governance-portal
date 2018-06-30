import { createReducer } from "../utils/redux";

// Constants ----------------------------------------------

const MODAL_OPEN = "modal/MODAL_OPEN";
const MODAL_CLOSE = "modal/MODAL_CLOSE";

// Actions ------------------------------------------------

export const modalOpen = modal => ({
  type: MODAL_OPEN,
  payload: { name: modal }
});

export const modalClose = () => ({ type: MODAL_CLOSE });

// Reducer ------------------------------------------------

const initialState = {
  modal: ""
};

const modal = createReducer(initialState, {
  [MODAL_OPEN]: (state, { payload }) => ({ ...state, modal: payload.name }),
  [MODAL_CLOSE]: state => ({ ...state, modal: "" })
});

export default modal;
