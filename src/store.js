import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import {
  localLinkProgress,
  updateAccountsAfterLink,
  failureLogging
} from './middleware';
import rootReducer from './reducers';

export default function() {
  // in case user's local storage has been set by a previous iteration of
  // localLinkProgress middleware
  if (
    localStorage.getItem('linkInitiatedState') &&
    JSON.parse(localStorage.getItem('linkInitiatedState')).setupProgress ===
      'initiate'
  ) {
    localStorage.clear();
    window.location.reload();
  }

  return createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        ReduxThunk,
        localLinkProgress,
        updateAccountsAfterLink,
        failureLogging
      )
    )
  );
}
