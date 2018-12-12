import { useReducer } from 'react';

export const TxLifecycle = {
  NULL: 'NULL',
  INITIALIZED: 'INITIALIZED',
  PENDING: 'PENDING',
  MINED: 'MINED',
  ERROR: 'ERROR'
};

const initialState = {
  hash: '',
  sender: '',
  errorMsg: '',
  status: TxLifecycle.NULL
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'initialized':
      return {
        ...state,
        sender: payload.sender,
        status: TxLifecycle.INITIALIZED
      };
    case 'pending':
      return { ...state, hash: payload.hash, status: TxLifecycle.PENDING };
    case 'mined':
      return { ...state, status: TxLifecycle.MINED };
    case 'error':
      return { ...state, status: TxLifecycle.ERROR, errorMsg: payload.msg };
    case 'clear':
      return { ...initialState };
    default:
      return state;
  }
}

const useMakerTx = txCb => {
  const [txDetails, dispatch] = useReducer(reducer, initialState);

  const clear = () => dispatch({ type: 'clear' });

  const send = () => {
    clear();
    const txObject = txCb(window.maker);
    const sender = window.maker.currentAddress();
    window.maker.service('transactionManager').listen(txObject, {
      initialized: () => {
        dispatch({ type: 'initialized', payload: { sender } });
      },
      pending: tx => {
        dispatch({ type: 'pending', payload: { hash: tx.hash } });
      },
      mined: () => {
        dispatch({ type: 'mined' });
      },
      error: (_, err) => {
        dispatch({ type: 'error', payload: { msg: err.message } });
      }
    });
    return txObject;
  };

  return { ...txDetails, ...TxLifecycle, send, clear };
};

export default useMakerTx;
