export const localLinkProgress = store => next => action => {
  if (action.type === 'proxy/INITIATE_LINK_SUCCESS') {
    const {
      initiateLinkTxHash,
      setupProgress,
      hotAddress,
      coldAddress
    } = store.getState().proxy;
    localStorage.setItem(
      'linkInitiatedState',
      JSON.stringify({
        initiateLinkTxHash,
        setupProgress,
        hotAddress,
        coldAddress
      })
    );
  }
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    localStorage.removeItem('linkInitiated');
  }
  next(action);
};
