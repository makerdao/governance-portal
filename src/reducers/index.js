import { combineReducers } from 'redux';
import metamask from './metamask';
import modal from './modal';
import proposals from './proposals';
import tally from './tally';
import approvals from './approvals';
import proxy from './proxy';
import accounts from './accounts';
import vote from './vote';
import hat from './hat';
import toasts from './toasts';
import eth from './eth';
import onboarding from './onboarding';
import polling from './polling';
import esm from './esm';

const rootReducer = combineReducers({
  metamask,
  modal,
  proposals,
  tally,
  approvals,
  proxy,
  accounts,
  vote,
  hat,
  eth,
  toasts,
  onboarding,
  polling,
  esm
});

export default rootReducer;
