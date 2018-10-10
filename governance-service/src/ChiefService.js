import { PrivateService, MKR } from '@makerdao/dai';
import CHIEF from './utils/constants';
// maybe a "dai.js developer utils" package is useful?
import { getCurrency } from '@makerdao/dai/src/eth/Currency';

export default class ChiefService extends PrivateService {
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
