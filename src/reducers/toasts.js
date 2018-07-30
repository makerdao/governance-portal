import { createReducer } from '../utils/redux';
import { parseError } from '../utils/misc';
export { Toasts as ToastTypes } from '../utils/constants';

// Constants ----------------------------------------------

const ADD_TOAST = 'toast/ADD_TOAST';
const REMOVE_TOAST = 'toast/REMOVE_TOAST';

// Actions ------------------------------------------------

const addToast = (id, type, message) => {
  return {
    type: ADD_TOAST,
    payload: {
      toast: {
        id,
        type,
        message
      }
    }
  };
};

const removeToast = id => {
  return { type: REMOVE_TOAST, payload: { id } };
};

let nextToastId = 0;
export const addToastWithTimeout = (type, error) => dispatch => {
  const message = parseError(error);
  const id = nextToastId++;
  dispatch(addToast(id, type, message));
  setTimeout(() => {
    dispatch(removeToast(id));
  }, 5000);
};

// Reducer ------------------------------------------------

const initialState = [];

const toasts = createReducer(initialState, {
  [ADD_TOAST]: (state, { payload }) => [...state, payload.toast],
  [REMOVE_TOAST]: (state, { payload }) =>
    state.filter(toast => toast.id !== payload.id)
});

export default toasts;
