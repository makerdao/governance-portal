//////////////////////////////////////////////////////////
//// Sign & send transactions to the ethereum network ////
//////////////////////////////////////////////////////////

import {
  getTxDetails,
  getMethodSig,
  getProxyFactory,
  getMkrAddress,
  encodeParameter,
  sendSignedTx
} from './web3';
import { getProxyStatus } from './read';
import {
  generateCallData,
  removeHexPrefix,
  stringToHex,
  etherToWei
} from '../utils/ethereum';
import ledgerSubprovider from './ledger';

/**
 * @desc metamask send transaction
 * @param  {Object} transaction { from, to, value, data, gasPrice, gasLimit }
 * @return {Promise} tx
 */
export const metamaskSendTx = transaction =>
  new Promise((resolve, reject) => {
    const from =
      transaction.from.substr(0, 2) === '0x'
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === '0x'
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? etherToWei(transaction.value) : '0x00';
    const data = transaction.data ? transaction.data : '0x';
    getTxDetails({
      from,
      to,
      data,
      value,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit
    })
      .then(txDetails => {
        if (typeof window.web3 !== 'undefined') {
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
 * @desc ledger send transaction
 * @param  {Object}  transaction { from, to, value, data, gasPrice}
 * @return {Promise}
 */
export const ledgerSendTransaction = transaction =>
  new Promise((resolve, reject) => {
    const from =
      transaction.from.substr(0, 2) === '0x'
        ? transaction.from
        : `0x${transaction.from}`;
    const to =
      transaction.to.substr(0, 2) === '0x'
        ? transaction.to
        : `0x${transaction.to}`;
    const value = transaction.value ? etherToWei(transaction.value) : '0x00';
    const data = transaction.data ? transaction.data : '0x';
    getTxDetails({
      from,
      to,
      data,
      value,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit
    })
      .then(txDetails => {
        ledgerSubprovider
          .signTransaction(txDetails)
          .then(signedTx =>
            sendSignedTx(signedTx)
              .then(txHash => resolve(txHash))
              .catch(error => reject(error))
          )
          .catch(error => reject(error));
      })
      .catch(error => reject(error));
  });

export const sendTransactionMulti = (type, tranasction) => {
  switch (type) {
    case 'METAMASK':
      return metamaskSendTx(tranasction);
    case 'LEDGER':
      return ledgerSendTransaction(tranasction);
    default:
      return metamaskSendTx(tranasction);
  }
};

/**
 * @async @desc initate vote-proxy link
 * @param  {Object} wallets { acccount: { address, type }, hotAddress }
 * @return {Promise} tx
 */
export const initiateLink = async ({ coldAccount, hotAddress }) => {
  const cold = coldAccount.address;
  const factory = await getProxyFactory();
  const methodSig = getMethodSig('initiateLink(address)');
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(hotAddress)]
  });
  const tx = { to: factory, from: cold, data: callData };
  return sendTransactionMulti(coldAccount.type, tx);
};

/**
 * @async @desc approve vote-proxy link
 * @param  {Object} wallets { acccount: { address, type }, hot }
 * @return {Promise} tx
 */
export const approveLink = async ({ hotAccount, coldAddress }) => {
  const hot = hotAccount.address;
  const factory = await getProxyFactory();
  const methodSig = getMethodSig('approveLink(address)');
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(coldAddress)]
  });
  const tx = { to: factory, from: hot, data: callData };
  return sendTransactionMulti(hotAccount.type, tx);
};

/**
 * @async @desc transfer Mkr to this address's proxy
 * @param  {Object} transferDetails { acccount: { address, type }, value }
 * @return {Promise} tx
 */
export const sendMkrToProxy = async ({ account, value }) => {
  const { address: proxyAddress, hasProxy } = await getProxyStatus(
    account.address
  );
  if (!hasProxy)
    throw new Error(
      `${account.address} cannot send MKR to its proxy because none exists`
    );
  const mkrToken = await getMkrAddress();
  const methodSig = getMethodSig('transfer(address,uint256)');
  const weiAmtHex = stringToHex(etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proxyAddress), removeHexPrefix(weiAmtHex)]
  });
  const tx = { to: mkrToken, from: account.address, data: callData };
  return sendTransactionMulti(account.type, tx);
};

/**
 * @async @desc vote for a single proposal via a vote-proxy
 * @param {Object} voteDetails { acccount: { address, type }, proposalAddress }
 * @return {Promise} tx
 */
export const voteViaProxy = async ({ account, proposalAddress }) => {
  const { address: proxyAddress, hasProxy } = await getProxyStatus(
    account.address
  );
  if (!hasProxy)
    throw new Error(
      `${account.address} cannot vote because it doesn't have a proxy`
    );
  const methodSig = getMethodSig('vote(address[])');
  const proposalParam = encodeParameter('address[]', [proposalAddress]);
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proposalParam)]
  });
  const tx = { to: proxyAddress, from: account.address, data: callData };
  return sendTransactionMulti(account.type, tx);
};

/**
 * @async @desc lock all MKR in a vote-proxy vote for a single proposal
 * @param {Object} voteDetails { acccount: { address, type }, proposalAddress }
 * @return {Promise} tx
 */
export const voteAndLockViaProxy = async ({ account, proposalAddress }) => {
  const { address: proxyAddress, hasProxy } = await getProxyStatus(
    account.address
  );
  if (!hasProxy)
    throw new Error(
      `${account.address} cannot vote and lock because it doesn't have a proxy`
    );
  const methodSig = getMethodSig('voteAndLock(address[])');
  const proposalParam = encodeParameter('address[]', [proposalAddress]);
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proposalParam)]
  });
  const tx = { to: proxyAddress, from: account.address, data: callData };
  return sendTransactionMulti(account.type, tx);
};
