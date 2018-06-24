import Web3 from "web3";
import last from "ramda/src/last";

import {
  generateCallData,
  removeHexPrefix,
  hexWeiToEther,
  netIdToName,
  paddedBytes32ToAddress
} from "../helpers";
import contractMethods from "../contracts/methods.json";
import addresses from "../contracts/addresses.json";

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
 * @param {String} network
 * @return {String}
 */
const getChief = async () => {
  const network = await getNetworkName();
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
 * @return {String}
 */
export const getApprovalCount = async address => {
  const chief = await getChief();
  const methodSig = contractMethods.approvals.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const approvalsHex = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  const approvals = hexWeiToEther(approvalsHex);
  return approvals;
};

/**
 * @desc get address's current voted slate
 * @param  {String} address
 * @return {String}
 */
export const getVotedSlate = async address => {
  const chief = await getChief();
  const methodSig = contractMethods.votes.hash;
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
  const methodSig = contractMethods.deposits.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const depositsHexWei = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  const deposits = hexWeiToEther(depositsHexWei);
  return deposits;
};

/**
 * @desc get slate's addresses
 * @param  {String} slateHex
 * @return {String}
 */
export const getSlateAddresses = async slateHex => {
  const chief = await getChief();
  const methodSig = contractMethods.slates.hash;
  const slateAddresses = [];
  let index = 0;
  // solidity's auto-gen'd getter for the (bytes32=>address[]) mapping requires the index
  // of the address array as a second arg, so we have to loop until we've found all the addresses
  // (╯°□°）╯︵ ┻━┻)
  do {
    const addressArrIndex = index.toString();
    const callData = generateCallData({
      method: methodSig,
      args: [removeHexPrefix(slateHex), addressArrIndex]
    });
    const slateElement = await web3Instance.eth.call({
      to: chief,
      data: callData
    });
    const slateAddress = paddedBytes32ToAddress(slateElement);
    slateAddresses.push(slateAddress);
    index++;
  } while (last(slateAddresses) !== "0x");
  slateAddresses.pop();
  return slateAddresses;
};
