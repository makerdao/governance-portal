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

const now = new Date();
const nowMinute = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate(),
  now.getHours(),
  now.getMinutes(),
  0,
  0
);
const delay = new Date(nowMinute.getTime() + 30 * 60 * 1000);
export const POLL_DEFAULT_START = delay.getTime();
export const POLL_DEFAULT_END = new Date(
  delay.getTime() + 7 * 24 * 60 * 60 * 1000
).getTime();

const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
export const URL_REGEX = new RegExp(expr);

export const MIN_MKR_PERCENTAGE = 0.01;
export const POSTGRES_MAX_INT = 2147483647;
