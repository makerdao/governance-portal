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
