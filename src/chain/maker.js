import Governance from '../../governance-service/src/index';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

const { ETH, MKR } = Governance;

const governance = Governance.create('browser', {
  plugins: [trezorPlugin, ledgerPlugin],
  log: false
});

Object.freeze(governance);

export { ETH, MKR };
export default governance;
