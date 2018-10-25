import Governance from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import { ETH, MKR } from '@makerdao/dai';

const governance = Governance.create('browser', {
  plugins: [trezorPlugin, ledgerPlugin],
  log: false
});

console.log('started creating governance');

global.maker = governance;

governance.authenticate().then(() => {
  console.log('done authenticating');
});

export { ETH, MKR };
export default governance;
