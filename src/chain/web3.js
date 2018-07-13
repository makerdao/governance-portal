import Web3 from "web3";

import { netIdToName } from "../utils/ethereum";
import addresses from "./addresses.json";

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
export const getNetworkName = async () => {
  const networkId = await web3Instance.eth.net.getId();
  const network = netIdToName(networkId);
  return network;
};

/**
 * @async @desc get chief's address
 * @param {String} [_network]
 * @return {String}
 */
export const getChief = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const chief = addresses[network].chief;
  return chief;
};

/**
 * @async @desc get vote proxy factory's address
 * @param {String} [_network]
 * @return {String}
 */
export const getProxyFactory = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const factory = addresses[network].proxy_factory;
  return factory;
};

/**
 * @async @desc get vote MKR address
 * @param {String} [_network]
 * @return {String}
 */
export const getMkrAddress = async (_network = "") => {
  const network = _network || (await getNetworkName());
  const mkr = addresses[network].mkr;
  return mkr;
};

/**
 * @desc get method's ethereum hash signature
 * @param  {String} methodString
 * @return {String}
 */
export const getMethodSig = methodString =>
  web3Instance.utils.sha3(methodString).substring(0, 10);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, "pending");

/**
 * @desc get Encodes a parameter based on its type to its ABI representation.
 * @param {String} type
 * @param {String} param
 * @return {Promise}
 */
export const encodeParameter = (type, param) =>
  web3Instance.eth.abi.encodeParameter(type, param);

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
 * @async returns a promise that resolves after a transaction has a set number of confirmations
 * @param  {String} transaction
 * @param  {Object} { confirmations }
 * @return {Promise}
 */
export const awaitTx = (txnHash, { confirmations = 6 }) => {
  const INTERVAL = 500;
  const transactionReceiptAsync = async function(txnHash, resolve, reject) {
    try {
      const receipt = web3Instance.eth.getTransactionReceipt(txnHash);
      if (!receipt) {
        setTimeout(
          () => transactionReceiptAsync(txnHash, resolve, reject),
          INTERVAL
        );
      } else {
        const resolvedReceipt = await receipt;
        if (!resolvedReceipt || !resolvedReceipt.blockNumber) {
          setTimeout(
            () => transactionReceiptAsync(txnHash, resolve, reject),
            INTERVAL
          );
        } else {
          try {
            const [txBlock, currentBlock] = await Promise.all([
              web3Instance.eth.getBlock(resolvedReceipt.blockNumber),
              web3Instance.eth.getBlock("latest")
            ]);
            if (currentBlock.number - txBlock.number >= confirmations) {
              const txn = await web3Instance.eth.getTransaction(txnHash);
              if (txn.blockNumber != null) resolve(resolvedReceipt);
              else
                reject(
                  new Error(
                    "Transaction with hash: " +
                      txnHash +
                      " ended up in an uncle block."
                  )
                );
            } else
              setTimeout(
                () => transactionReceiptAsync(txnHash, resolve, reject),
                INTERVAL
              );
          } catch (e) {
            setTimeout(
              () => transactionReceiptAsync(txnHash, resolve, reject),
              INTERVAL
            );
          }
        }
      }
    } catch (e) {
      reject(e);
    }
  };
  return new Promise((resolve, reject) =>
    transactionReceiptAsync(txnHash, resolve, reject)
  );
};

// MetaMask -------------------------------------

/**
 * @desc get metmask selected network
 * @return {Promise}
 */
export const getMetamaskNetworkName = () => {
  if (typeof window.web3 !== "undefined") {
    return new Promise((resolve, reject) => {
      window.web3.version.getNetwork((err, networkID) => {
        if (err) {
          reject(err);
        }
        const networkName = netIdToName(networkID);
        resolve(networkName);
      });
    });
  }
};
