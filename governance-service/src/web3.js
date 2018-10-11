import Web3 from 'web3';

import {
  generateCallData,
  netIdToName,
  removeHexPrefix,
  weiToEther
} from './utils/ethereum';

const addresses = {
  kovan: require('../contracts/addresses/kovan.json'),
  mainnet: require('../contracts/addresses/mainnet.json')
};

try {
  const testnetAddresses = require('../contracts/addresses/testnet.json');
  addresses.ganache = testnetAddresses;
} catch (err) {
  // do nothing here; throw an error only if we later attempt to use ganache
}

// cached singleton values
let web3Instance, web3NetworkName;

// this is exported for use in tests; it should not be used outside this file
// otherwise.
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
  switch (network) {
    case 'kovan':
      setWeb3Provider(`https://${network}.infura.io/`);
      break;
    case 'ganache':
      setWeb3Provider('http://127.0.0.1:2000/');
      break;
    default:
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
  web3NetworkName = null;
};

/**
 * @async @desc get avg gas price of last couple blocs
 * @return {Promise}
 */
export const getGasPriceEstimate = () =>
  getWeb3Instance()
    .eth.getGasPrice()
    .then(weiToEther);

/**
 * @async @desc sign and send a tx from an unlocked account
 * @param {Object} txObject
 * @return {Promise}
 */
export const sendTxUnlocked = txObject =>
  getWeb3Instance().eth.sendTransaction(txObject);

/**
 * @async @desc get current network name
 * @return {String}
 */
export const getNetworkName = async () => {
  if (!web3NetworkName) {
    const networkId = await getWeb3Instance().eth.net.getId();
    web3NetworkName = netIdToName(networkId);
  }
  return web3NetworkName;
};

export const getBalance = async address => {
  const value = await getWeb3Instance().eth.getBalance(address);
  return weiToEther(value);
};

const getContractAddress = name => async network => {
  if (!['chief', 'proxy_factory', 'mkr', 'pip'].includes(name)) {
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
 * @async @desc get eth price oracle address
 * @param {String} [_network]
 * @return {String}
 */
export const getPip = getContractAddress('pip');

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
 * @desc number string to hexadecimal
 * @param  {String|Number} mixed
 * @return {String}
 */
export const toHex = mixed => getWeb3Instance().utils.toHex(mixed);

/**
 * @desc get Encodes a parameter based on its type to its ABI representation.
 * @param {String} type
 * @param {String} param
 * @return {Promise}
 */
export const encodeParameter = (type, param, removePrefix) => {
  const value = getWeb3Instance().eth.abi.encodeParameter(type, param);
  return removePrefix ? removeHexPrefix(value) : value;
};

/**
 * @async @desc get transaction details
 * @param  {Object} transaction { from, to, data, value, gasPrice, gasLimit }
 * @return {Object}
 */
export const getTxDetails = async ({ from, to, data, value, ganache }) => {
  let { gasLimit, gasPrice } = await estimateGas({ from, to, data, value });
  // we're underestimate gas limit when on ganache –> figure out why that is
  gasPrice = Number(gasPrice) + 1000000000;
  if (ganache) gasLimit += 200000; // FIXME
  const nonce = await getTransactionCount(from);
  return {
    from: from,
    to: to,
    nonce: toHex(nonce),
    gasPrice: toHex(gasPrice),
    gasLimit: toHex(gasPrice),
    gas: toHex(gasLimit),
    value: toHex(value),
    data: data
  };
};

/**
 * @async @desc get estimated gas limit and gas price
 * @param  {String} { from, to, data, value }
 * @return {Object} { gasPrice, gasLimit }
 */
export const estimateGas = async ({ from, to, data, value }) => {
  // getGasPrice gets median gas price of the last few blocks from some oracle
  const gasPrice = await getWeb3Instance().eth.getGasPrice();
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data };
  // this fails if web3 thinks that the transaction will fail
  const gasLimit = await getWeb3Instance().eth.estimateGas(estimateGasData);
  return { gasPrice, gasLimit };
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
export const awaitTx = async (txHash, { confirmations = 1 }) => {
  const delay = () => new Promise(resolve => setTimeout(resolve, 250));
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

export async function ethCall(to, method, args) {
  const network = await getNetworkName();
  switch (to) {
    case 'mkr':
      to = await getMkrAddress(network);
      break;
    case 'chief':
      to = await getChief(network);
      break;
    case 'factory':
      to = await getProxyFactory(network);
      break;
    case 'pip':
      to = await getPip(network);
      break;
    default:
    // do nothing; assume `to` is an address string literal
  }
  const data = generateCallData({ method: getMethodSig(method), args });
  return getWeb3Instance().eth.call({ to, data });
}

export async function getEthLogs(options) {
  return getWeb3Instance().eth.getPastLogs(options);
}

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
