import { PrivateService } from '@makerdao/dai';
import PROXY_FACTORY from './utils/constants';

export default class VoteProxyFactoryService extends PrivateService {
  constructor(name = 'voteProxyFactory') {
    super(name, ['smartContract', 'voteProxy']);
  }

  initiateLink(hotAddress) {
    return this._proxyFactoryContract().initiateLink(hotAddress);
  }

  approveLink(coldAddress) {
    return this._proxyFactoryContract().approveLink(coldAddress);
  }

  breakLink() {
    return this._proxyFactoryContract().breakLink();
  }

  getVoteProxy(address) {
    return this.get('voteProxy').getVoteProxy(address);
  }

  _proxyFactoryContract() {
    return this.get('smartContract').getContractByName(PROXY_FACTORY);
  }
}
