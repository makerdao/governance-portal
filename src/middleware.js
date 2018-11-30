import Raven from 'raven-js';

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
