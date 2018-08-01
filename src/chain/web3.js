import Web3 from 'web3';

import { netIdToName } from '../utils/ethereum';
import addresses from './addresses.json';

try {
  const testnetAddresses = require('./testnet-addresses.json');
  addresses.ganache = testnetAddresses;
} catch (err) {
  // do nothing here; throw an error only if we later attempt to use ganache
}

let web3Instance;

export function getWeb3Instance() {
  if (!web3Instance) {
    throw new Error(
      'web3Instance was not initialized by calling setWeb3Network yet.'
    );
  }
  return web3Instance;
}

// for all testnets except kovan, use mainnet instead
export function setWeb3Network(network) {
  if (network === 'kovan') {
    setWeb3Provider(`https://${network}.infura.io/`);
  } else {
    setWeb3Provider('https://mainnet.infura.io/');
  }
}

/**
 * @desc set a different web3 provider
 * @param {String} provider
 */
export const setWeb3Provider = provider => {
  let providerObj = null;
  if (typeof provider === 'string' && provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  } else if (typeof provider === 'object') {
    providerObj = provider;
  }
  if (!providerObj) {
    throw new Error(
      'Provider must be a valid HTTP/HTTPS endpoint URL or a provider instance'
    );
  }
  if (!web3Instance) {
    web3Instance = new Web3(providerObj);
  } else {
    web3Instance.setProvider(providerObj);
  }
};

/**
 * @async @desc get current network name
 * @return {String}
 */
export const getNetworkName = async () => {
  const networkId = await getWeb3Instance().eth.net.getId();
  const network = netIdToName(networkId);
  return network;
};

const getContractAddress = name => async network => {
  if (!['chief', 'proxy_factory', 'mkr'].includes(name)) {
    throw new Error(`Unrecognized contract name: "${name}"`);
  }
  if (!network) network = await getNetworkName();
  if (network === 'ganache' && !addresses.ganache) {
    throw new Error(
      'No testnet contract addresses are configured. Did you run deploy-gov?'
    );
  }
  return addresses[network][name];
};

/**
 * @async @desc get chief's address
 * @param {String} [_network]
 * @return {String}
 */
export const getChief = getContractAddress('chief');

/**
 * @async @desc get vote proxy factory's address
 * @param {String} [_network]
 * @return {String}
 */
export const getProxyFactory = getContractAddress('proxy_factory');

/**
 * @async @desc get vote MKR address
 * @param {String} [_network]
 * @return {String}
 */
export const getMkrAddress = getContractAddress('mkr');

/**
 * @desc get method's ethereum hash signature
 * @param  {String} methodString
 * @return {String}
 */
export const getMethodSig = methodString =>
  getWeb3Instance()
    .utils.sha3(methodString)
    .substring(0, 10);

/**
 * @desc get address transaction count
 * @param {String} address
 * @return {Promise}
 */
export const getTransactionCount = address =>
  getWeb3Instance().eth.getTransactionCount(address, 'pending');

/**
 * @desc get Encodes a parameter based on its type to its ABI representation.
 * @param {String} type
 * @param {String} param
 * @return {Promise}
 */
export const encodeParameter = (type, param) =>
  getWeb3Instance().eth.abi.encodeParameter(type, param);

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
  const _gasPrice = gasPrice || (await getWeb3Instance().eth.getGasPrice());
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data };
  // this fails if web3 thinks that the transaction will fail
  const _gasLimit =
    gasLimit || (await getWeb3Instance().eth.estimateGas(estimateGasData));
  const nonce = await getTransactionCount(from);
  const tx = {
    from: from,
    to: to,
    nonce: getWeb3Instance().utils.toHex(nonce),
    gasPrice: getWeb3Instance().utils.toHex(_gasPrice),
    gasLimit: getWeb3Instance().utils.toHex(_gasLimit),
    gas: getWeb3Instance().utils.toHex(_gasLimit),
    value: getWeb3Instance().utils.toHex(value),
    data: data
  };
  return tx;
};

/**
 * @desc send signed transaction
 * @param  {String}  signedTx
 * @return {Promise}
 */
export const sendSignedTx = signedTx =>
  new Promise((resolve, reject) => {
    const serializedTx = typeof signedTx === 'string' ? signedTx : signedTx.raw;
    getWeb3Instance()
      .eth.sendSignedTransaction(serializedTx)
      .once('transactionHash', txHash => resolve(txHash))
      .catch(error => reject(error));
  });

/**
 * @async resolves after a transaction has a set number of confirmations
 * @param  {String} transaction
 * @param  {Object} { confirmations }
 * @return {Promise}
 */
export const awaitTx = async (txHash, { confirmations = 3 }) => {
  const delay = () => new Promise(resolve => setTimeout(resolve, 500));
  const { eth } = getWeb3Instance();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const receipt = await eth.getTransactionReceipt(txHash);
    if (!receipt || !receipt.blockNumber) {
      await delay();
      continue;
    }

    const [txBlock, currentBlock] = await Promise.all([
      eth.getBlock(receipt.blockNumber),
      eth.getBlock('latest')
    ]);

    if (
      currentBlock &&
      txBlock &&
      currentBlock.number - txBlock.number >= confirmations
    ) {
      const txn = await eth.getTransaction(txHash);
      if (!txn.blockNumber) {
        throw new Error(`Transaction ${txHash} ended up in an uncle block.`);
      }
      return receipt;
    }

    await delay();
  }
};

// MetaMask -------------------------------------

/**
 * @desc get metmask selected network
 * @return {Promise}
 */
export const getMetamaskNetworkName = () => {
  return new Promise((resolve, reject) => {
    window.web3.version.getNetwork(
      (err, id) => (err ? reject(err) : resolve(netIdToName(id)))
    );
    setTimeout(
      () => reject('Taking too long to get metamask network name'),
      20000
    );
  });
};
