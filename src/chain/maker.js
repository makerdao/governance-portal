import Maker from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
// maybe a "dai.js developer utils" package is useful?
import { getCurrency } from '@makerdao/dai/src/eth/Currency';

import * as reads from './read';
import * as writes from './write';
import * as web3 from './web3';
import addresses from './addresses.json';
import voteProxyAbi from './vote-proxy-abi.json';

const { ETH, MKR } = Maker;

const PROXY_FACTORY = 'PROXY_FACTORY';
const CHIEF = 'CHIEF';

class ChiefService extends Maker.PrivateService {
  constructor(name = 'chief') {
    super(name, ['smartContract']);
  }

  // Writes -----------------------------------------------

  etch = addresses => this._chiefContract().etch(addresses);

  lift = address => this._chiefContract().lift(address);

  vote = picks => {
    if (Array.isArray(picks))
      return this._chiefContract()['vote(address[])'](picks);
    return this._chiefContract()['vote(bytes32)'](picks);
  };

  lock = (amt, unit = MKR) => {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._chiefContract().lock(mkrAmt);
  };

  free = (amt, unit = MKR) => {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._chiefContract().free(mkrAmt);
  };

  // Reads ------------------------------------------------

  getVotedSlate = address => this._chiefContract().votes(address);

  getNumDeposits = address =>
    this._chiefContract()
      .deposits(address)
      .then(MKR.wei);

  getApprovalCount = address =>
    this._chiefContract()
      .approvals(address)
      .then(MKR.wei);

  getHat = () => this._chiefContract().hat();

  getSlateAddresses = async (slateHash, i = 0) => {
    try {
      return [await this._chiefContract().slates(slateHash, i)].concat(
        await this.getSlateAddresses(slateHash, i + 1)
      );
    } catch (_) {
      return [];
    }
  };

  getLockAddressLogs = () =>
    new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .LogNote({ sig: '0xdd467064' }, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.guy));
        });
    });

  getEtchSlateLogs = () =>
    new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .Etch({}, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.slate));
        });
    });

  getVoteTally = () => {}; // TODO

  getVoteProxy = address => {}; // TODO

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

  lock = (proxyAddress, amt, unit = MKR) => {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).lock(mkrAmt);
  };

  free = (proxyAddress, amt, unit = MKR) => {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).free(mkrAmt);
  };

  voteExec = (proxyAddress, picks) => {
    if (Array.isArray(picks))
      return this._proxyContract(proxyAddress)['vote(address[])'](picks);
    return this._proxyContract(proxyAddress)['vote(bytes32)'](picks);
  };

  getLinkedAddress = (proxyAddress, proxyRole) => {
    if (proxyRole === 'hot') return this._proxyContract(proxyAddress).cold();
    else if (proxyRole === 'cold')
      return this._proxyContract(proxyAddress).hot();
    return null;
  };

  getNumDeposits = proxyAddress =>
    this.get('chief').getNumDeposits(proxyAddress);

  // getVotedSlate
  // getVotedProposals

  getVoteProxy = (address, role) => new VoteProxy(this, address, role);

  _proxyContract = address =>
    this.get('smartContract').getContractByAddressAndAbi(address, voteProxyAbi);
}

class VoteProxy {
  constructor(voteProxyService, address = null, role = null) {
    this._voteProxyService = voteProxyService;
    this._address = address;
    this._role = role;
  }

  getAddress = () => this._address;
  getRole = () => this._role;
  getStatus = () => ({
    proxyAddress: this.getAddress(),
    proxyRole: this.getRole()
  });
}

const passthroughMethods = ['lock', 'free', 'voteExec', 'getLinkedAddress'];

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
  // initiateLink
  // approveLink
  //   breakLink
  getVoteProxy = async address => {
    const { hasProxy, proxyRole, proxyAddress } = await this.getProxyStatus(
      address
    );
    if (!hasProxy) throw new Error('');
    return new VoteProxy(this.get('voteProxy'), proxyAddress, proxyRole);
  };

  getProxyStatus = async address => {
    const [proxyAddressCold, proxyAddressHot] = await Promise.all([
      this._proxyFactoryContract().coldMap(address),
      this._proxyFactoryContract().hotMap(address)
    ]);
    if (proxyAddressCold !== '0x0000000000000000000000000000000000000000')
      return { type: 'cold', address: proxyAddressCold, hasProxy: true };
    if (proxyAddressHot !== '0x0000000000000000000000000000000000000000')
      return { type: 'hot', address: proxyAddressHot, hasProxy: true };
    return { type: null, address: '', hasProxy: false };
  };

  _proxyFactoryContract = () =>
    this.get('smartContract').getContractByName(PROXY_FACTORY);
}

class Governance {
  constructor(preset, config = {}) {
    const addContracts = {
      [CHIEF]: {
        address: addresses.mainnet.chief, // can we parameterize this by network?
        abi: require('./chief-abi.json')
      },
      [PROXY_FACTORY]: {
        address: addresses.mainnet.proxy_factory,
        abi: require('./proxy-factory-abi.json')
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

for (let method of ['authenticate', 'service']) {
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
