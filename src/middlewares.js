import { goToStep } from './reducers/proxy';

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
        setupProgress: 'resume',
        hotAddress,
        coldAddress
      })
    );
  }
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    localStorage.removeItem('linkInitiated');
  }
  if (
    action.type === 'modal/MODAL_OPEN' &&
    store.getState().proxy.setupProgress === 'initiate'
  ) {
    store.dispatch(goToStep('resume'));
  }
  return next(action);
};
