import Maker from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
// maybe a "dai.js developer utils" package is useful?
import { getCurrency } from '@makerdao/dai/src/eth/Currency';

import * as reads from './read';
import * as writes from './write';
import * as web3 from './web3';
import voteProxyAbi from './abis/VoteProxy.json';
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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

const { ETH, MKR } = Maker;
const PROXY_FACTORY = 'PROXY_FACTORY';
const CHIEF = 'CHIEF';

class ChiefService extends Maker.PrivateService {
  constructor(name = 'chief') {
    super(name, ['smartContract']);
  }

  // TODO: getVoteTally

  // Writes -----------------------------------------------

  etch(addresses) {
    return this._chiefContract().etch(addresses);
  }

  lift(address) {
    return this._chiefContract().lift(address);
  }

  vote(picks) {
    if (Array.isArray(picks))
      return this._chiefContract()['vote(address[])'](picks);
    return this._chiefContract()['vote(bytes32)'](picks);
  }

  lock(amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._chiefContract().lock(mkrAmt);
  }

  free(amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._chiefContract().free(mkrAmt);
  }

  // Reads ------------------------------------------------

  getVotedSlate(address) {
    return this._chiefContract().votes(address);
  }

  getNumDeposits(address) {
    return this._chiefContract()
      .deposits(address)
      .then(MKR.wei);
  }

  getApprovalCount(address) {
    return this._chiefContract()
      .approvals(address)
      .then(MKR.wei);
  }

  getHat() {
    return this._chiefContract().hat();
  }

  async getSlateAddresses(slateHash, i = 0) {
    try {
      return [await this._chiefContract().slates(slateHash, i)].concat(
        await this.getSlateAddresses(slateHash, i + 1)
      );
    } catch (_) {
      return [];
    }
  }

  getLockAddressLogs() {
    return new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .LogNote({ sig: '0xdd467064' }, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.guy));
        });
    });
  }

  getEtchSlateLogs() {
    return new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .Etch({}, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.slate));
        });
    });
  }

  // Internal --------------------------------------------

  _chiefContract({ web3js = false } = {}) {
    if (web3js) return this.get('smartContract').getWeb3ContractByName(CHIEF);
    return this.get('smartContract').getContractByName(CHIEF);
  }
}

class VoteProxyService extends Maker.PrivateService {
  constructor(name = 'voteProxy') {
    super(name, ['smartContract', 'chief']);
  }

  // TODO: getVoteProxy

  // Writes -----------------------------------------------

  lock(proxyAddress, amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).lock(mkrAmt);
  }

  free(proxyAddress, amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).free(mkrAmt);
  }

  voteExec(proxyAddress, picks) {
    if (Array.isArray(picks))
      return this._proxyContract(proxyAddress)['vote(address[])'](picks);
    return this._proxyContract(proxyAddress)['vote(bytes32)'](picks);
  }

  // Reads ------------------------------------------------

  getLinkedAddress(proxyAddress, proxyRole) {
    if (proxyRole === 'hot') return this._proxyContract(proxyAddress).cold();
    else if (proxyRole === 'cold')
      return this._proxyContract(proxyAddress).hot();
    return null;
  }

  async getVotedProposalAddresses(proxyAddress) {
    const _slate = await this.get('chief').getVotedSlate(proxyAddress);
    return this.get('chief').getSlateAddresses(_slate);
  }

  // Internal --------------------------------------------

  _proxyContract(address) {
    return this.get('smartContract').getContractByAddressAndAbi(
      address,
      voteProxyAbi
    );
  }

  _proxyFactoryContract() {
    return this.get('smartContract').getContractByName(PROXY_FACTORY);
  }
}

// add Chief Service methods to the Vote Proxy Service
Object.assign(
  VoteProxyService.prototype,
  ['getVotedSlate', 'getNumDeposits'].reduce((acc, name) => {
    acc[name] = function(...args) {
      return this.get('chief')[name](...args);
    };
    return acc;
  }, {})
);

class VoteProxy {
  constructor(voteProxyService, address = null, role = null) {
    this._voteProxyService = voteProxyService;
    this._address = address;
    this._role = role;
  }

  getAddress() {
    return this._address;
  }

  getRole() {
    return this._role;
  }

  getStatus() {
    return {
      proxyAddress: this.getAddress(),
      proxyRole: this.getRole()
    };
  }

  getLinkedAddress() {
    return this._voteProxyService.getLinkedAddress(
      this.getAddress(),
      this.getRole()
    );
  }
}

const passthroughMethods = ['lock', 'free', 'voteExec', 'getNumDeposits'];

Object.assign(
  VoteProxy.prototype,
  passthroughMethods.reduce((acc, name) => {
    acc[name] = function(...args) {
      return this._voteProxyService[name](this._address, ...args);
    };
    return acc;
  }, {})
);

class VoteProxyFactoryService extends Maker.PrivateService {
  constructor(name = 'voteProxyFactory') {
    super(name, ['smartContract', 'voteProxy']);
  }

  // TODO: initiateLink, approveLink, breakLink

  async getVoteProxy(address) {
    const { hasProxy, proxyRole, proxyAddress } = await this.getProxyStatus(
      address
    );
    if (!hasProxy)
      throw new Error(`address ${address} doesn't have a vote proxy`);
    return new VoteProxy(this.get('voteProxy'), proxyAddress, proxyRole);
  }

  async getProxyStatus(address) {
    const [proxyAddressCold, proxyAddressHot] = await Promise.all([
      this._proxyFactoryContract().coldMap(address),
      this._proxyFactoryContract().hotMap(address)
    ]);

    if (proxyAddressCold !== ZERO_ADDRESS)
      return { type: 'cold', address: proxyAddressCold, hasProxy: true };
    if (proxyAddressHot !== ZERO_ADDRESS)
      return { type: 'hot', address: proxyAddressHot, hasProxy: true };
    return { type: null, address: '', hasProxy: false };
  }

  _proxyFactoryContract() {
    return this.get('smartContract').getContractByName(PROXY_FACTORY);
  }
}

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
