import Web3 from "web3";
import last from "ramda/src/last";

import {
  generateCallData,
  removeHexPrefix,
  weiToEther,
  netIdToName,
  paddedBytes32ToAddress,
  isZeroAddress,
  etherToWei,
  stringToHex
} from "../helpers/ethereum";
import addresses from "../contracts/addresses.json";
import chiefInfo from "../contracts/chief-info.json";

export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://kovan.infura.io/`)
);
// mainnet
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
 * @async @desc get current network name
 * @return {String}
 */
const getNetworkName = async () => {
  const networkId = await web3Instance.eth.net.getId();
  const network = netIdToName(networkId);
  return network;
};

/**
 * @async @desc get chief's address
 * @param {String} [_network]
 * @return {String}
 */
const getChief = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const chief = addresses[network].chief;
  return chief;
};

/**
 * @async @desc get vote proxy factory's address
 * @param {String} [_network]
 * @return {String}
 */
const getProxyFactory = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const factory = addresses[network].proxy_factory;
  return factory;
};

/**
 * @async @desc get vote MKR address
 * @param {String} [_network]
 * @return {String}
 */
const getMkrAddress = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const mkr = addresses[network].mkr;
  return mkr;
};

/**
 * @desc get method's ethereum hash signature
 * @param  {String} methodString
 * @return {String}
 */
const getMethodSig = methodString =>
  web3Instance.utils.sha3(methodString).substring(0, 10);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, "pending");

/**
 * @async @desc get address approval count
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
 * @async @desc get address's current voted slate
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
 * @async @desc get address's deposited GOV
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
 * @async @desc get slate's addresses
 * @param  {String} slateHex
 * @return {String[]} addresses
 */
export const getSlateAddresses = async slateHex => {
  const chief = await getChief();
  const methodSig = chiefInfo.methods.slates.hash;
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
 * @typedef {Object} proxyStatus
 * @property {Boolean} isHot
 * @property {Boolean} isCold
 * @property {String} proxy
 */

/**
 * @async @desc get the address of associated vote proxy if this wallet were cold
 * @param {String} address
 * @return {proxyStatus}
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

/**
 * @async @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async ({
  from,
  to,
  data,
  value,
  gasPrice,
  gasLimit
}) => {
  // getGasPrice gets median gas price of the last few blocks from some oracle
  const _gasPrice = gasPrice || (await web3Instance.eth.getGasPrice());
  const estimateGasData = value === "0x00" ? { from, to, data } : { to, data };
  // this fails if web3 thinks that the transaction will fail
  const _gasLimit =
    gasLimit || (await web3Instance.eth.estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  const tx = {
    from: from,
    to: to,
    nonce: web3Instance.utils.toHex(nonce),
    gasPrice: web3Instance.utils.toHex(_gasPrice),
    gasLimit: web3Instance.utils.toHex(_gasLimit),
    gas: web3Instance.utils.toHex(_gasLimit),
    value: web3Instance.utils.toHex(value),
    data: data
  };
  return tx;
};

/**
 * @desc metamask send transaction
 * @param  {Object} transaction { from, to, value, data, gasPrice, gasLimit }
 * @return {Promise} tx
 */
export const web3MetamaskSendTransaction = transaction =>
  new Promise((resolve, reject) => {
    const from =
      transaction.from.substr(0, 2) === "0x"
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === "0x"
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? etherToWei(transaction.value) : "0x00";
    const data = transaction.data ? transaction.data : "0x";
    getTxDetails({
      from,
      to,
      data,
      value,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit
    })
      .then(txDetails => {
        if (typeof window.web3 !== "undefined") {
          window.web3.eth.sendTransaction(txDetails, (err, txHash) => {
            if (err) {
              reject(err);
            }
            resolve(txHash);
          });
        } else {
          throw new Error(`Metamask is not installed`);
        }
      })
      .catch(error => reject(error));
  });

/**
 * @async @desc metamask send transaction
 * @param  {Object}  wallets { cold, hot }
 * @return {Promise} tx
 */
export const buildVoteProxy = async ({ cold, hot }) => {
  const factory = await getProxyFactory();
  const methodSig = getMethodSig("newVoteProxy(address,address)");
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(cold), removeHexPrefix(hot)]
  });
  const tx = { to: factory, from: cold, data: callData };
  return web3MetamaskSendTransaction(tx);
};

/**
 * @async @desc metamask send transaction
 * @param  {Object} transferDetails { from, value }
 * @return {Promise} tx
 */
export const sendMkrToProxy = async ({ from, value }) => {
  const { proxy } = await getProxyStatus(from);
  const mkrToken = await getMkrAddress();
  const methodSig = getMethodSig("transfer(address,uint256)");
  // TODO error handle if isCold is false
  const weiAmtHex = stringToHex(etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proxy), removeHexPrefix(weiAmtHex)]
  });
  const tx = { to: mkrToken, from, data: callData };
  return web3MetamaskSendTransaction(tx);
};

/**
 * @desc get metmask selected network
 * @return {Promise}
 */
export const getMetamaskNetworkName = async () => {
  if (typeof window.web3 !== "undefined") {
    window.web3.version.getNetwork((err, networkID) => {
      if (err) {
        console.error(err);
        throw new Error(err);
      }
      const networkName = netIdToName(networkID);
      return networkName || null;
    });
  }
};
