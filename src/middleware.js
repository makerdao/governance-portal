import Raven from 'raven-js';

import { refreshAccountDataLink } from './reducers/proxy';

export const updateAccountsAfterLink = store => next => action => {
  if (action.type === 'proxy/APPROVE_LINK_SUCCESS') {
    setTimeout(() => store.dispatch(refreshAccountDataLink()), 2500);
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
