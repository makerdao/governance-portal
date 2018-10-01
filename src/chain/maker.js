import Maker from '@makerdao/dai';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
// maybe a "dai.js developer utils" package is useful?
import { getCurrency } from '@makerdao/dai/src/eth/Currency';

import * as reads from './read';
import * as writes from './write';
import * as web3 from './web3';
import addresses from './addresses.json';

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
  constructor(name = 'voteProxy', address = null) {
    super(name, ['smartContract', 'web3', 'token']);
    this._proxyAddress = address;
  }
  // voteExec
  // lock
  // free
  // getStatus
  // getAddress
  // getVotedSlate
  // getVotedProposals
  // getNumDeposits
  // hasInfMkrApproval
  // getLinkedAddress
  // getVoteProxy
}

class VoteProxyFactoryService extends Maker.PrivateService {
  constructor(name = 'voteProxy') {
    super(name, ['smartContract', 'web3', 'token']);
  }
  // initiateLink
  // approveLink
  // breakLink
  // getVoteProxy
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
