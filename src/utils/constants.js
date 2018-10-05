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
