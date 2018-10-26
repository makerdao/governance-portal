import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';

export default Maker.create('browser', {
  plugins: [trezorPlugin, ledgerPlugin, governancePlugin],
  autoAuthenticate: true,
  log: false
});

export { ETH, MKR };
