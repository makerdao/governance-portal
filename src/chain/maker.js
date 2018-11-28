import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';

export default function createMaker(preset, options = {}) {
  return Maker.create(preset, {
    plugins: [trezorPlugin, ledgerPlugin, governancePlugin],
    autoAuthenticate: true,
    log: false,
    ...options
  });
}

export { ETH, MKR };
