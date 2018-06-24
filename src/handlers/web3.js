import Web3 from "web3";
import flow from "lodash/flow";

import {
  generateCallData,
  removeHexPrefix,
  hexToNumString,
  weiToEther
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
 * @desc get address approval count
 * @param  {String} address
 * @param  {String} [_network]
 * @return {Number}
 */
export const getApprovalCount = async (address, _network = "") => {
  const network = _network || (await web3Instance.eth.net.getNetworkType());
  const chief = addresses[network].chief;
  const methodSig = contractMethods.approvals.hash;
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(address)]
  });
  const approvalsHex = await web3Instance.eth.call({
    to: chief,
    data: callData
  });
  const approvals = flow([hexToNumString, weiToEther])(approvalsHex);
  return approvals;
};
