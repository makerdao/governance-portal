import round from 'lodash.round';
import { ETH, MKR } from '../../chain/maker';
import { toNum } from '../../utils/misc';

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
