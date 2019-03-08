import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';

import { netToUri } from '../utils/ethereum';

export default async function createMaker(
  network = 'mainnet',
  testchainConfigId
) {
  let gasPrice = 6 * 10 ** 9; // default to 6 Gwei gas price
  try {
    // check ethgasstation for gas price info
    const res = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
    const gasData = await res.json();
    gasPrice = gasData.average * 10 ** 8;
    gasPrice = gasPrice + 3 * 10 ** 9; // 3 Gwei buffer
  } catch (err) {
    console.error(
      `Gas price fetch failed. Defaulting to ${gasPrice / 10 ** 9} Gwei.`
    );
  }

  return Maker.create('http', {
    plugins: [trezorPlugin, ledgerPlugin, [governancePlugin, { network }]],
    autoAuthenticate: true,
    log: false,
    web3: {
      transactionSettings: {
        gasPrice
      }
    },
    provider: {
      url: netToUri(network),
      type: 'HTTP'
    }
  });
}

export { ETH, MKR };
