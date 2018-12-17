// useful function for tests to get actions by type rather than index
// https://michalzalecki.com/testing-redux-thunk-like-you-always-want-it/
function findAction(store, type) {
  return store.getActions().find(action => action.type === type);
}

export function getAction(store, type) {
  const action = findAction(store, type);
  if (!action || action === 'undefined') return null;
  if (action) return Promise.resolve(action);
}
