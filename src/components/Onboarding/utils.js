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
