import Raven from 'raven-js';

import { goToStep, postLinkUpdate } from './reducers/proxy';

export const localLinkProgress = store => next => action => {
  if (action.type === 'proxy/INITIATE_LINK_SUCCESS') {
    const {
      initiateLinkTxHash,
      hotAddress,
      coldAddress
    } = store.getState().proxy;
    localStorage.setItem(
      'linkInitiatedState',
      JSON.stringify({
        initiateLinkTxHash,
        setupProgress: 'midLink',
        hotAddress,
        coldAddress
      })
    );
  }
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    localStorage.removeItem('linkInitiatedState');
  }
  if (
    action.type === 'modal/MODAL_OPEN' &&
    store.getState().proxy.setupProgress === 'initiate'
  ) {
    store.dispatch(goToStep('midLink'));
  }
  return next(action);
};

export const updateAccountsAfterLink = store => next => action => {
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    store.dispatch(postLinkUpdate());
  }
  return next(action);
};

export const failureLogging = store => next => action => {
  if (action.type.slice(-7) === 'FAILURE') {
    Raven.captureException(action.type, {
      extra: {
        action,
        state: store.getState()
      }
    });
  }
  return next(action);
};
