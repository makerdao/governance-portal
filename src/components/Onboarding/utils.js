import round from 'lodash.round';
import { ETH, MKR } from '../../chain/maker';
import { toNum } from '../../utils/misc';
import { AccountTypes } from '../../utils/constants';

export const addMkrAndEthBalance = async account => {
  return {
    ...account,
    ethBalance: round(
      await toNum(window.maker.getToken(ETH).balanceOf(account.address)),
      3
    ),
    mkrBalance: round(
      await toNum(window.maker.getToken(MKR).balanceOf(account.address)),
      3
    )
  };
};

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
