import { createReducer } from "../utils/redux";
import { getMkrBalance } from "../chain/read";
import { sendMkrToProxy } from "../chain/send";

// Constants ----------------------------------------------

const UPDATE_MKR_BALANCE = "user/UPDATE_MKR_BALANCE";
const SEND_MKR_TO_PROXY = "user/SEND_MKR_TO_PROXY";

// Actions ------------------------------------------------

export const userInit = address => dispatch => {
  getMkrBalance(address).then(mkr => {
    dispatch({ type: UPDATE_MKR_BALANCE, payload: { mkr } });
  });
};

export const userSendMkrToProxy = value => (dispatch, getState) => {
  // TODO higher level account address
  const userAddress = getState().metamask.accountAddress;
  sendMkrToProxy({ from: userAddress, value: value }).then(txHash => {
    dispatch({ type: SEND_MKR_TO_PROXY, payload: { txHash } });
  });
};

// Reducer ------------------------------------------------

const initialState = {
  mkr: 0,
  txHash: ""
};

const user = createReducer(initialState, {
  [UPDATE_MKR_BALANCE]: (state, { payload }) => ({
    ...state,
    mkr: payload.mkr
  }),
  [SEND_MKR_TO_PROXY]: (state, { payload }) => ({
    ...state,
    txHash: payload.txHash
  })
});

export default user;
