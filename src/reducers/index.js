import { combineReducers } from 'redux';
import metamask from './metamask';
import modal from './modal';
import topics from './topics';
import tally from './tally';
import approvals from './approvals';
import proxy from './proxy';
import accounts from './accounts';
import vote from './vote';
import hat from './hat';

const rootReducer = combineReducers({
  metamask,
  modal,
  topics,
  tally,
  approvals,
  proxy,
  accounts,
  vote,
  hat
});

export default rootReducer;
