import Web3 from 'web3';

import { netIdToName } from '../utils/ethereum';
import addresses from './addresses.json';

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
export async function setWeb3Network(network) {
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
const setWeb3Provider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      'function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint'
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
  const networkId = await web3Instance.eth.net.getId();
  const network = netIdToName(networkId);
  return network;
};

/**
 * @async @desc get chief's address
 * @param {String} [_network]
 * @return {String}
 */
export const getChief = async (_network = '') => {
  const network = _network || (await getNetworkName());
  const chief = addresses[network].chief;
  return chief;
};

/**
 * @async @desc get vote proxy factory's address
 * @param {String} [_network]
 * @return {String}
 */
export const getProxyFactory = async (_network = '') => {
  const network = _network || (await getNetworkName());
  const factory = addresses[network].proxy_factory;
  return factory;
};

/**
 * @async @desc get vote MKR address
 * @param {String} [_network]
 * @return {String}
 */
export const getMkrAddress = async (_network = '') => {
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
  web3Instance.eth.getTransactionCount(address, 'pending');

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
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data };
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
 * @desc send signed transaction
 * @param  {String}  signedTx
 * @return {Promise}
 */
export const sendSignedTx = signedTx =>
  new Promise((resolve, reject) => {
    const serializedTx = typeof signedTx === 'string' ? signedTx : signedTx.raw;
    web3Instance.eth
      .sendSignedTransaction(serializedTx)
      .once('transactionHash', txHash => resolve(txHash))
      .catch(error => reject(error));
  });

/**
 * @async returns a promise that resolves after a transaction has a set number of confirmations
 * @param  {String} transaction
 * @param  {Object} { confirmations }
 * @return {Promise}
 */
export const awaitTx = (txnHash, { confirmations = 3 }) => {
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
              web3Instance.eth.getBlock('latest')
            ]);
            if (currentBlock.number - txBlock.number >= confirmations) {
              const txn = await web3Instance.eth.getTransaction(txnHash);
              if (txn.blockNumber != null) resolve(resolvedReceipt);
              else
                reject(
                  new Error(
                    'Transaction with hash: ' +
                      txnHash +
                      ' ended up in an uncle block.'
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
