import VoteProxy from './VoteProxy';
import { PrivateService, MKR } from '@makerdao/dai';
import ZERO_ADDRESS from './utils/constants';
import PROXY_FACTORY from './utils/constants';
// maybe a "dai.js developer utils" package is useful?
import { getCurrency } from '@makerdao/dai/src/eth/Currency';
import voteProxyAbi from '../contracts/abis/VoteProxy.json';

export default class VoteProxyService extends PrivateService {
  constructor(name = 'voteProxy') {
    super(name, ['smartContract', 'chief']);
  }

  // Writes -----------------------------------------------

  lock(proxyAddress, amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).lock(mkrAmt);
  }

  free(proxyAddress, amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toEthersBigNumber('wei');
    return this._proxyContract(proxyAddress).free(mkrAmt);
  }

  freeAll(proxyAddress) {
    return this._proxyContract(proxyAddress).freeAll();
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

  async getVoteProxy(voterAddress) {
    const {
      hasProxy,
      role,
      address: proxyAddress
    } = await this._getProxyStatus(voterAddress);
    return {
      hasProxy,
      voteProxy: hasProxy ? new VoteProxy(this, proxyAddress, role) : null
    };
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

  async _getProxyStatus(address) {
    const [proxyAddressCold, proxyAddressHot] = await Promise.all([
      this._proxyFactoryContract().coldMap(address),
      this._proxyFactoryContract().hotMap(address)
    ]);
    if (proxyAddressCold !== ZERO_ADDRESS)
      return { role: 'cold', address: proxyAddressCold, hasProxy: true };
    if (proxyAddressHot !== ZERO_ADDRESS)
      return { role: 'hot', address: proxyAddressHot, hasProxy: true };
    return { role: null, address: '', hasProxy: false };
  }
}

// add a few Chief Service methods to the Vote Proxy Service
Object.assign(
  VoteProxyService.prototype,
  ['getVotedSlate', 'getNumDeposits'].reduce((acc, name) => {
    acc[name] = function(...args) {
      return this.get('chief')[name](...args);
    };
    return acc;
  }, {})
);
