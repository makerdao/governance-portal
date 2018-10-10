export default class VoteProxy {
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

const passthroughMethods = [
  'lock',
  'free',
  'voteExec',
  'getNumDeposits',
  'getVotedProposalAddresses'
];

Object.assign(
  VoteProxy.prototype,
  passthroughMethods.reduce((acc, name) => {
    acc[name] = function(...args) {
      return this._voteProxyService[name](this._address, ...args);
    };
    return acc;
  }, {})
);
