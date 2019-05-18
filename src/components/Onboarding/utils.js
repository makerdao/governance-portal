import { AccountTypes } from '../../utils/constants';

export const nicelyFormatWalletProvider = provider => {
  switch (provider) {
    case 'provider':
    case 'browser':
    case 'metamask':
    case AccountTypes.METAMASK:
      return 'MetaMask';
    case AccountTypes.TREZOR:
      return 'Trezor';
    case AccountTypes.LEDGER:
      return 'Ledger';
    default:
      return 'your wallet';
  }
};

export const ensureWalletLink = (hotWallet, coldWallet) => {
  if (coldWallet && !hotWallet) hotWallet = coldWallet.proxy.linkedAccount;
  if (hotWallet && !coldWallet) coldWallet = hotWallet.proxy.linkedAccount;
  return { hotWallet, coldWallet };
};
