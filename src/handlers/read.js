///////////////////////////////////////////
//// Read chain state & get event logs ////
///////////////////////////////////////////

import last from "ramda/src/last";

import {
  getMethodSig,
  getChief,
  getProxyFactory,
  getNetworkName,
  web3Instance
} from "./web3";
import {
  generateCallData,
  removeHexPrefix,
  weiToEther,
  paddedBytes32ToAddress,
  isZeroAddress
} from "../utils/ethereum";
import chiefInfo from "../contracts/chief-info.json";

/**
 * @async @desc get address approval count
 * @param  {String} address
 * @return {String} number of approvals
 */
export const getApprovalCount = async address => {
  const chief = await getChief();
  const methodSig = getMethodSig("approvals(address)");
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
 * @async @desc get address's current voted slate
 * @param  {String} address
 * @return {String} slateHex
 */
export const getVotedSlate = async address => {
  const chief = await getChief();
  const methodSig = getMethodSig("votes(address)");
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
 * @async @desc get address's deposited GOV
 * @param  {String} address
 * @return {String}
 */
export const getNumDeposits = async address => {
  const chief = await getChief();
  const methodSig = getMethodSig("deposits(address)");
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
 * @async @desc get slate's addresses
 * @param  {String} slateHex
 * @return {String[]} addresses
 */
export const getSlateAddresses = async slateHex => {
  const chief = await getChief();
  const methodSig = getMethodSig("slates(bytes32)");
  /**
   * @async @param  {Number} [i] index
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
 * @async @desc use event logs to get all etched slates
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

/**
 * @async @desc get the address of associated vote proxy if this wallet were hot
 * @param {String} address
 * @return {String} address
 */
export const getProxyAddressHot = async address => {
  const factory = await getProxyFactory();
  const methodSig = getMethodSig("hotMap(address)");
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const hotMapVal = await web3Instance.eth.call({
    to: factory,
    data: callData
  });
  const proxyAddress = paddedBytes32ToAddress(hotMapVal);
  return proxyAddress;
};

/**
 * @async @desc get the address of associated vote proxy if this wallet were cold
 * @param {String} address
 * @return {String} address
 */
export const getProxyAddressCold = async address => {
  const factory = await getProxyFactory();
  const methodSig = getMethodSig("coldMap(address)");
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const coldMapVal = await web3Instance.eth.call({
    to: factory,
    data: callData
  });
  const proxyAddress = paddedBytes32ToAddress(coldMapVal);
  return proxyAddress;
};

/**
 * @async @desc get the address of associated vote proxy if this wallet were cold
 * @param {String} address
 * @return {Object}
 */
export const getProxyStatus = async address => {
  const proxyAddressHot = await getProxyAddressHot(address);
  if (!isZeroAddress(proxyAddressHot)) {
    return { isHot: true, isCold: false, proxy: proxyAddressHot };
  }
  const proxyAddressCold = await getProxyAddressCold(address);
  if (!isZeroAddress(proxyAddressCold)) {
    return { isHot: false, isCold: true, proxy: proxyAddressCold };
  }
  return { isHot: false, isCold: false, proxy: "" };
};
