///////////////////////////////////////////
//// Read chain state & get event logs ////
///////////////////////////////////////////

import last from 'ramda/src/last';
import nth from 'ramda/src/nth';
import uniq from 'ramda/src/uniq';
import memoizeWith from 'ramda/src/memoizeWith';
import identity from 'ramda/src/identity';

import { getChief, getNetworkName, getEthLogs, ethCall } from './web3';
import {
  removeHexPrefix,
  weiToEther,
  paddedBytes32ToAddress,
  isZeroAddress,
  MAX_UINT
} from '../../src/utils/ethereum';
import { add } from '../../src/utils/misc.js';
import contractInfo from './contract-info.json';

const chiefInfo = contractInfo.chief;
const proxyFactoryInfo = contractInfo.proxy_factory;

export const getLinkGas = () => proxyFactoryInfo.total_link_gas;

/**
 * @async @desc get proposal address approval count
 * @param  {String} address
 * @return {String} number of approvals
 */
export const getApprovalCount = async address => {
  const approvalsHex = await ethCall('chief', 'approvals(address)', [
    removeHexPrefix(address)
  ]);
  return weiToEther(approvalsHex);
};

/**
 * @async @desc get address's current voted slate
 * @param  {String} address
 * @return {String} slateHex
 */
export const getVotedSlate = async address => {
  return ethCall('chief', 'votes(address)', [removeHexPrefix(address)]);
};

/**
 * @async @desc get address's deposited GOV
 * @param  {String} address
 * @return {String}
 */
export const getNumDeposits = async address => {
  const depositsHexWei = await ethCall('chief', 'deposits(address)', [
    removeHexPrefix(address)
  ]);
  return weiToEther(depositsHexWei);
};

/**
 * @async @desc get slate's addresses
 * @param  {String} slateHex
 * @return {String[]} addresses
 */
export const getSlateAddresses = async slateHex => {
  /**
   * @async @param  {Number} [i] index
   * @param  {String[]} [arr] array
   * @return {String[]} addresses
   */
  const traverseSlate = async (i = 0, arr = []) => {
    // solidity's auto-gen'd getter for the (bytes32=>address[]) mapping
    // requires the index of the address array as a second arg, so we have to
    // step through addresses until we've found them all (╯°□°）╯︵ ┻━┻)
    const slateElement = await ethCall('chief', 'slates(bytes32,uint256)', [
      removeHexPrefix(slateHex),
      i.toString()
    ]);
    if (slateElement === '0x') return arr;
    const slateAddress = paddedBytes32ToAddress(slateElement);
    return traverseSlate(i + 1, [...arr, slateAddress]);
  };
  return traverseSlate();
};

export const getHat = async () => {
  return ethCall('chief', 'hat()', []);
};

/**
 * @async @desc use event logs to get all etched slates
 * @return {String[]} slates
 */
export const getEtchedSlates = async () => {
  const network = await getNetworkName();
  const chief = await getChief(network);
  const etches = await getEthLogs({
    fromBlock: chiefInfo.inception_block[network],
    toBlock: 'latest',
    address: chief,
    topics: [chiefInfo.events.etch]
  });
  return etches.map(logObj => last(logObj.topics));
};

const getProxyAddressFrom = hotOrCold => async address => {
  const value = await ethCall('factory', `${hotOrCold}Map(address)`, [
    removeHexPrefix(address)
  ]);
  return paddedBytes32ToAddress(value);
};

/**
 * @async @desc get the address of associated vote proxy if this wallet were hot
 * @param {String} address
 * @return {String} address
 */
export const getProxyAddressFromHot = getProxyAddressFrom('hot');

/**
 * @async @desc get the address of associated vote proxy if this wallet were cold
 * @param {String} address
 * @return {String} address
 */
export const getProxyAddressFromCold = getProxyAddressFrom('cold');

/**
 * @async @desc get the address of associated vote proxy if this wallet were cold
 * @param {String} address
 * @return {Object} { type, address }
 */
export const getProxyStatus = async address => {
  return Promise.all([
    getProxyAddressFromHot(address),
    getProxyAddressFromCold(address)
  ]).then(([proxyAddressHot, proxyAddressCold]) => {
    if (!isZeroAddress(proxyAddressHot)) {
      return { type: 'hot', address: proxyAddressHot, hasProxy: true };
    }
    if (!isZeroAddress(proxyAddressCold)) {
      return { type: 'cold', address: proxyAddressCold, hasProxy: true };
    }
    return { type: null, address: '', hasProxy: false };
  });
};

/**
 * @async @desc use event logs to get all addresses that've locked
 * @return {String[]} addresses
 */
export const getLockLogs = async () => {
  const network = await getNetworkName();
  const chief = await getChief(network);
  const locks = await getEthLogs({
    fromBlock: chiefInfo.inception_block[network],
    toBlock: 'latest',
    address: chief,
    topics: [chiefInfo.events.lock]
  });
  return uniq(
    locks.map(logObj => nth(1, logObj.topics)).map(paddedBytes32ToAddress)
  );
};

// helper for when we might call getSlateAddresses with the same slate several times
const memoizedGetSlateAddresses = memoizeWith(identity, getSlateAddresses);

/**
 * @async @desc get the voter approvals and address for each proposal
 * @return {Object}
 */
export const getVoteTally = async () => {
  const voters = await getLockLogs();
  // we could use web3's "batch" feature here, but it doesn't seem that it would be any faster
  // https://ethereum.stackexchange.com/questions/47918/how-to-make-batch-transaction-in-ethereum
  const withDeposits = await Promise.all(
    voters.map(voter =>
      getNumDeposits(voter).then(deposits => ({
        address: voter,
        deposits: parseFloat(deposits)
      }))
    )
  );

  const withSlates = await Promise.all(
    withDeposits.map(addressDeposit =>
      getVotedSlate(addressDeposit.address).then(slate => ({
        ...addressDeposit,
        slate
      }))
    )
  );

  const withVotes = await Promise.all(
    withSlates.map(withSlate =>
      memoizedGetSlateAddresses(withSlate.slate).then(addresses => ({
        ...withSlate,
        votes: addresses
      }))
    )
  );

  const voteTally = {};
  for (const voteObj of withVotes) {
    for (const vote of voteObj.votes) {
      if (voteTally[vote] === undefined) {
        voteTally[vote] = {
          approvals: voteObj.deposits,
          addresses: [{ address: voteObj.address, deposits: voteObj.deposits }]
        };
      } else {
        voteTally[vote].approvals += voteObj.deposits;
        voteTally[vote].addresses.push({
          address: voteObj.address,
          deposits: voteObj.deposits
        });
      }
    }
  }
  for (const [key, value] of Object.entries(voteTally)) {
    const sortedAddresses = value.addresses.sort(
      (a, b) => b.deposits - a.deposits
    );
    const approvals = voteTally[key].approvals;
    const withPercentages = sortedAddresses.map(shapedVoteObj => ({
      ...shapedVoteObj,
      percent: ((shapedVoteObj.deposits * 100) / approvals).toFixed(2)
    }));
    voteTally[key] = withPercentages;
  }
  return voteTally;
};

/**
 * @async @desc use event logs to get all etched slates
 * @return {String} balance
 */
export const getMkrBalance = async address => {
  const hexBalance = await ethCall('mkr', 'balanceOf(address)', [
    removeHexPrefix(address)
  ]);
  return weiToEther(hexBalance);
};

export const getLinkedAddress = async (proxyAddress, role) => {
  const value = await ethCall(
    proxyAddress,
    role === 'hot' ? 'hot()' : 'cold()',
    []
  );
  return paddedBytes32ToAddress(value);
};

/**
 * @async @desc get voting power of user address
 * @param {String} address user address
 * @return {String} votingPower
 */
export const getVotingPower = async proxyAddress => {
  const [proxyMkr, proxyDeposits] = await Promise.all([
    getMkrBalance(proxyAddress),
    getNumDeposits(proxyAddress)
  ]);
  return add(proxyMkr, proxyDeposits);
};

/**
 * @async @desc get eth price from maker oracle
 * @return {String} ethPrice
 */
export const getEthPrice = async () => {
  return ethCall('pip', 'read()', []).then(weiToEther);
};

/**
 * @async @desc return whether target has infinite MKR approvals for accountAddress
 * @return {Bool}
 */
export const hasInfMkrApproval = async (accountAddress, target) => {
  const allowance = await ethCall('mkr', 'allowance(address,address)', [
    removeHexPrefix(accountAddress),
    removeHexPrefix(target)
  ]);
  return allowance === MAX_UINT;
};
