import Maker from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

import * as reads from './read';
import * as writes from './write';
import * as web3 from './web3';

class ChiefService extends Maker.PrivateService {
  constructor(name = 'chief') {
    super(name, ['smartContract', 'web3']);
  }
}

class VoteProxyService extends Maker.PrivateService {
  constructor(name = 'voteProxy') {
    super(name, ['smartContract', 'web3']);
  }
}

const _maker = Maker.create('browser', {
  plugins: [trezorPlugin, ledgerPlugin],
  additionalServices: ['chief', 'voteProxy'],
  chief: [ChiefService],
  voteProxy: [VoteProxyService]
});

class Governance {}
Object.assign(Governance.prototype, { ...reads });
Object.assign(Governance.prototype, { ...writes });
Object.assign(Governance.prototype, { ...web3 });

Governance.prototype.authenticate = () => _maker.authenticate();
Governance.prototype.service = type => _maker.service(type);

const governance = new Governance();
Object.freeze(governance);

export default governance;
