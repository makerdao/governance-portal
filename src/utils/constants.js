import { getUtcDateObject } from './misc';

export const AccountTypes = {
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  METAMASK: 'browser'
};

export const Toasts = {
  ERROR: 'ERROR',
  NEUTRAL: 'NEUTRAL',
  SUCCESS: 'SUCCESS'
};

export const TransactionStatus = {
  NOT_STARTED: 'not-started',
  PENDING: 'pending',
  MINED: 'mined',
  CONFIRMED: 'confirmed',
  ERROR: 'error'
};

export const PollTxState = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

export const CHIEF = 'CHIEF';

export const POLL_DEFAULT_START = getUtcDateObject();
export const POLL_DEFAULT_END = new Date(
  POLL_DEFAULT_START.getTime() + 7 * 24 * 60 * 60 * 1000
);

const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
export const URL_REGEX = new RegExp(expr);
