import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';

export default function createMaker(network = 'mainnet') {
  return Maker.create('http', {
    plugins: [trezorPlugin, ledgerPlugin, governancePlugin],
    autoAuthenticate: true,
    log: false,
    provider: {
      url: `https://${network}.infura.io/`,
      type: 'HTTP'
    }
  });
}

export { ETH, MKR };
