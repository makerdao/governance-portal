// -- Constants ------------------------------------------------------------- //

const UPDATE_ACCOUNT = "user/UPDATE_ACCOUNT";

// -- Actions --------------------------------------------------------------- //

export const updateAccount = account => ({
  type: UPDATE_ACCOUNT,
  payload: account
});

// -- Reducer --------------------------------------------------------------- //

const initialState = {
  activeAddress: ""
};

export default function user(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
