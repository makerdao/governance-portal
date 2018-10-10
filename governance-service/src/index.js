import Maker from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';

import ChiefService from './ChiefService';
import VoteProxyService from './VoteProxyService';
import VoteProxyFactoryService from './VoteProxyFactoryService';

import * as reads from './read';
import * as writes from './write';
import * as web3 from './web3';

import { map, prop } from 'ramda';

const contractAddresses = {
  kovan: require('./addresses/kovan.json'),
  mainnet: require('./addresses/mainnet.json')
};

try {
  const testnetAddresses = require('./addresses/testnet.json');
  contractAddresses.testnet = testnetAddresses;
} catch (err) {
  // do nothing here; throw an error only if we later attempt to use ganache
}

const { ETH, MKR } = Maker;

const PROXY_FACTORY = 'PROXY_FACTORY';
const CHIEF = 'CHIEF';

class Governance {
  constructor(preset, config = {}) {
    const addContracts = {
      [CHIEF]: {
        address: map(prop('chief'), contractAddresses),
        abi: require('./abis/DSChief.json')
      },
      [PROXY_FACTORY]: {
        address: map(prop('proxy_factory'), contractAddresses),
        abi: require('./abis/VoteProxyFactory.json')
      }
    };
    this.maker = Maker.create(preset, {
      ...config,
      additionalServices: ['chief', 'voteProxy', 'voteProxyFactory'],
      chief: [ChiefService],
      voteProxy: [VoteProxyService],
      voteProxyFactory: [VoteProxyFactoryService],
      smartContract: { addContracts }
    });
  }
}

Object.assign(Governance.prototype, { ...reads });
Object.assign(Governance.prototype, { ...writes });
Object.assign(Governance.prototype, { ...web3 });

const delegatedMakerMethods = [
  'authenticate',
  'service',
  'getToken',
  'addAccount',
  'currentAccount',
  'currentAddress',
  'listAccounts',
  'useAccount'
];

for (let method of delegatedMakerMethods) {
  Governance.prototype[method] = function(...args) {
    return this.maker[method](...args);
  };
}

Governance.create = function(preset, config) {
  return new Governance(preset, config);
};

const governance = Governance.create('browser', {
  plugins: [trezorPlugin, ledgerPlugin],
  log: false
});

Object.freeze(governance);

export { ETH, MKR };
export default governance;
