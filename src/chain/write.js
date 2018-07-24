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
  etherToWei
} from '../utils/ethereum';
import { AccountTypes } from '../utils/constants';

async function sendTransactionWithAccount(account, tx) {
  const from = tx.from.substr(0, 2) === '0x' ? tx.from : `0x${tx.from}`;
  const to = tx.to.substr(0, 2) === '0x' ? tx.to : `0x${tx.to}`;
  const value = tx.value ? etherToWei(tx.value) : '0x00';
  const data = tx.data ? tx.data : '0x';
  const txDetails = await getTxDetails({
    from,
    to,
    data,
    value,
    gasPrice: tx.gasPrice,
    gasLimit: tx.gasLimit
  });
  switch (account.type) {
    case AccountTypes.METAMASK:
      if (typeof window.web3 !== 'undefined') {
        return new Promise((resolve, reject) => {
          window.web3.eth.sendTransaction(txDetails, (err, txHash) => {
            if (err) reject(err);
            resolve(txHash);
          });
        });
      } else {
        throw new Error('Metamask is not installed');
      }
    case AccountTypes.TREZOR:
    case AccountTypes.LEDGER: {
      const signedTx = await account.subprovider.signTransaction(txDetails);
      return sendSignedTx(signedTx);
    }
    default:
      throw new Error(`Unrecognized account type: "${account.type}"`);
  }
}

/**
 * @async @desc initate vote-proxy link
 * @param  {Object} wallets { coldAccount: { address, type }, hotAddress }
 * @return {Promise} tx
 */
export const initiateLink = async ({ coldAccount, hotAddress }) => {
  const factory = await getProxyFactory();
  const methodSig = getMethodSig('initiateLink(address)');
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(hotAddress)]
  });
  const tx = { to: factory, from: coldAccount.address, data: callData };
  return sendTransactionWithAccount(coldAccount, tx);
};

/**
 * @async @desc approve vote-proxy link
 * @param  {Object} wallets { hotAccount: { address, type }, coldAddress }
 * @return {Promise} tx
 */
export const approveLink = async ({ hotAccount, coldAddress }) => {
  const factory = await getProxyFactory();
  const methodSig = getMethodSig('approveLink(address)');
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(coldAddress)]
  });
  const tx = { to: factory, from: hotAccount.address, data: callData };
  return sendTransactionWithAccount(hotAccount, tx);
};

/**
 * @async @desc transfer Mkr to this address's proxy
 * @param  {Object} transferDetails { acccount: { address, type }, value }
 * @return {Promise} tx
 */
export const sendMkrToProxy = async ({ account, value }) => {
  // FIXME probably don't need to slow down the process with this extra check;
  // just make sure the action can never be performed until we know we have a
  // proxy to send to.
  const { address: proxyAddress, hasProxy } = await getProxyStatus(
    account.address
  );
  if (!hasProxy)
    throw new Error(
      `${account.address} cannot send MKR to its proxy because none exists`
    );
  const mkrToken = await getMkrAddress();
  const methodSig = getMethodSig('transfer(address,uint256)');
  const addressParam = encodeParameter('address', proxyAddress);
  const valueParam = encodeParameter('uint256', etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(addressParam), removeHexPrefix(valueParam)]
  });
  const tx = { to: mkrToken, from: account.address, data: callData };
  return sendTransactionWithAccount(account, tx);
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
  return sendTransactionWithAccount(account, tx);
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
  const methodSig = getMethodSig('lockAllVote(address[])');
  const proposalParam = encodeParameter('address[]', [proposalAddress]);
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proposalParam)]
  });
  const tx = { to: proxyAddress, from: account.address, data: callData };
  return sendTransactionWithAccount(account, tx);
};

export const withdrawMkr = async (account, value) => {
  const methodSig = getMethodSig('withdraw(uint256)');
  const valueParam = encodeParameter('uint256', etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(valueParam)]
  });
  const tx = {
    to: account.proxy.address,
    from: account.address,
    data: callData
  };
  return sendTransactionWithAccount(account, tx);
};
