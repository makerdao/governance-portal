/* original from chain/constants */
export const AccountTypes = {
  LEDGER: 'LEDGER',
  TREZOR: 'TREZOR',
  METAMASK: 'METAMASK',
  GANACHE: 'GANACHE'
};

export const MakerJSAcctTypeConversion = {
  [AccountTypes.LEDGER]: 'ledger',
  [AccountTypes.TREZOR]: 'trezor',
  [AccountTypes.METAMASK]: 'browser',
  [AccountTypes.GANACHE]: 'provider'
};

export const Toasts = {
  ERROR: 'ERROR',
  NEUTRAL: 'NEUTRAL',
  SUCCESS: 'SUCCESS'
};

/* Contracts */
export const PROXY_FACTORY = 'PROXY_FACTORY';
export const CHIEF = 'CHIEF';

/* Addresses */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
