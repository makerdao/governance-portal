import Web3 from "web3";
import last from "ramda/src/last";

import {
  generateCallData,
  removeHexPrefix,
  weiToEther,
  netIdToName,
  paddedBytes32ToAddress
} from "../helpers";
import addresses from "../contracts/addresses.json";
import chiefInfo from "../contracts/chief-info.json";

export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/`)
);

/**
 * @desc set a different web3 provider
 * @param {String} provider
 */
export const web3SetHttpProvider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      "function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint"
    );
  }
  return web3Instance.setProvider(providerObj);
};

/**
 * @desc get current network name
 * @return {String}
 */
const getNetworkName = async () => {
  const networkId = await web3Instance.eth.net.getId();
  const network = netIdToName(networkId);
  return network;
};

/**
 * @desc get chief's address
 * @param {String} [_network]
 * @return {String}
 */
const getChief = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const chief = addresses[network].chief;
  return chief;
};

/**
 * @desc get method's ethereum hash signature
 * @param  {String} methodString
 * @return {String}
 */
const getMethodSig = methodString =>
  web3Instance.utils.sha3(methodString).substring(0, 10);

/**
 * @desc get address approval count
 * @param  {String} address
 * @return {String} number of approvals
 */
export const getApprovalCount = async address => {
  const chief = await getChief();
  const methodSig = chiefInfo.methods.approvals.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const approvalsHex = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  const approvals = weiToEther(approvalsHex);
  return approvals;
};

/**
 * @desc get address's current voted slate
 * @param  {String} address
 * @return {String} slateHex
 */
export const getVotedSlate = async address => {
  const chief = await getChief();
  const methodSig = chiefInfo.methods.votes.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const slateHex = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  return slateHex;
};

/**
 * @desc get address's deposited GOV
 * @param  {String} address
 * @return {String}
 */
export const getNumDeposits = async address => {
  const chief = await getChief();
  const methodSig = chiefInfo.methods.deposits.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const depositsHexWei = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  const deposits = weiToEther(depositsHexWei);
  return deposits;
};

/**
 * @desc get slate's addresses
 * @param  {String} slateHex
 * @return {String[]} addresses
 */
export const getSlateAddresses = async slateHex => {
  const chief = await getChief();
  const methodSig = chiefInfo.methods.slates.hash;
  /**
   * @param  {Number} [i] index
   * @param  {String[]} [arr] array
   * @return {String[]} addresses
   */
  const traverseSlate = async (i = 0, arr = []) => {
    // solidity's auto-gen'd getter for the (bytes32=>address[]) mapping requires the index
    // of the address array as a second arg, so we have to step through addresses until we've
    // found them all (╯°□°）╯︵ ┻━┻)
    const callData = generateCallData({
      method: methodSig,
      args: [removeHexPrefix(slateHex), i.toString()]
    });
    const slateElement = await web3Instance.eth.call({
      to: chief,
      data: callData
    });
    if (slateElement === "0x") return arr;
    const slateAddress = paddedBytes32ToAddress(slateElement);
    return traverseSlate(i + 1, [...arr, slateAddress]);
  };
  const addresses = await traverseSlate();
  return addresses;
};

/**
 * @desc use event logs to get all etched slates
 * @return {String[]} slates
 */
export const getEtchedSlates = async () => {
  const network = await getNetworkName();
  const chief = await getChief(network);
  const etches = await web3Instance.eth.getPastLogs({
    fromBlock: chiefInfo.inception_block[network],
    toBlock: "latest",
    address: chief,
    topics: [chiefInfo.events.etch]
  });
  const slates = etches.map(logObj => last(logObj.topics));
  return slates;
};
