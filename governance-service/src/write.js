//////////////////////////////////////////////////////////
//// Sign & send transactions to the ethereum network ////
//////////////////////////////////////////////////////////

import {
  getTxDetails,
  getMethodSig,
  getProxyFactory,
  getMkrAddress,
  encodeParameter,
  sendSignedTx,
  sendTxUnlocked
} from './web3';
import { getProxyStatus, getNumDeposits } from './read';
import {
  generateCallData,
  removeHexPrefix,
  etherToWei
} from './utils/ethereum';
import { AccountTypes } from './utils/constants';

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
    gasLimit: tx.gasLimit,
    ganache: account.type === AccountTypes.GANACHE // FIXME
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
    case AccountTypes.GANACHE:
      return sendTxUnlocked(txDetails);
    default:
      throw new Error(`Unrecognized account type: "${account.type}"`);
  }
}

// TODO: refactor more methods to use this. but we should set up tests first
async function simpleSendTx(account, to, method, args) {
  return sendTransactionWithAccount(account, {
    to,
    from: account.address,
    data: generateCallData({
      method: getMethodSig(method),
      args: args.map(([type, value]) => encodeParameter(type, value, true))
    })
  });
}

/**
 * @async @desc initate vote-proxy link
 * @param  {Object} wallets { coldAccount: { address, type }, hotAddress }
 * @return {Promise} tx
 */
export const initiateLink = async ({
  coldAccount,
  hotAddress,
  network = null
}) => {
  // factory is undefined?
  const factory = await getProxyFactory(network);
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
export const approveLink = async ({
  hotAccount,
  coldAddress,
  network = null
}) => {
  const factory = await getProxyFactory(network);
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
export const sendMkrToProxy = async ({ account, value, network = null }) => {
  // FIXME probably don't need to slow down the process with this extra check;
  // just make sure the action can never be performed until we know we have a
  // proxy to send to.
  const { address: proxyAddress, hasProxy } = await getProxyStatus(
    account.address,
    network
  );
  if (
    !hasProxy ||
    !account.hasProxy ||
    account.proxy.address.toLowerCase() !== proxyAddress.toLowerCase()
  )
    throw new Error(
      `${account.address} cannot send MKR to its proxy because none exists`
    );
  return sendMkr({ account, recipientAddress: proxyAddress, value, network });
};

/**
 * @async @desc transfer Mkr to some address
 * @param  {Object} transferDetails { acccount: { address, type }, value }
 * @return {Promise} tx
 */
export const sendMkr = async ({
  account,
  recipientAddress,
  value,
  network = null
}) => {
  const mkrToken = await getMkrAddress(network);
  const methodSig = getMethodSig('transfer(address,uint256)');
  const addressParam = encodeParameter('address', recipientAddress);
  const valueParam = encodeParameter('uint256', etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(addressParam), removeHexPrefix(valueParam)]
  });
  const tx = { to: mkrToken, from: account.address, data: callData };
  return sendTransactionWithAccount(account, tx);
};

export const voteExec = async ({ account, proposalAddress }) => {
  if (!account.hasProxy)
    throw new Error(
      `${account.address} cannot vote because account doesn't have a proxy`
    );
  const { address: proxyAddress } = account.proxy;
  return simpleSendTx(account, proxyAddress, 'vote(address[])', [
    ['address[]', [proposalAddress]]
  ]);
};

export const voteExecNone = async ({ account }) => {
  if (!account.hasProxy)
    throw new Error(
      `${account.address} cannot vote because account doesn't have a proxy`
    );
  const { address: proxyAddress } = account.proxy;
  return simpleSendTx(account, proxyAddress, 'vote(address[])', [
    ['address[]', []]
  ]);
};

/**
 * @async @desc break proxy link as long as proxy doesn't have mkr
 * @param {Object} account
 * @return {Promise} tx
 */
export const breakLink = async (account, network = null) => {
  const factory = await getProxyFactory(network);
  return simpleSendTx(account, factory, 'breakLink()', []);
};

/**
 * @async @desc give infinite mkr approvals to a target address
 * @param {Object} account
 * @param {String} target
 * @return {Promise} tx
 */
export const mkrApprove = async (account, target, network = null) => {
  const mkrToken = await getMkrAddress(network);
  return simpleSendTx(account, mkrToken, 'approve(address)', [
    ['address', target]
  ]);
};

/**
 * @async @desc push MKR to the proxy locking it into the voting contracts
 * @param {Object} { account, value }
 * @return {Promise} tx
 */
export const proxyLock = async ({ account, value }) => {
  if (!account.hasProxy)
    throw new Error(
      `${account.address} cannot lock because account doesn't have a proxy`
    );
  const { address: proxyAddress } = account.proxy;
  return simpleSendTx(account, proxyAddress, 'lock(uint256)', [
    ['uint256', etherToWei(value)]
  ]);
};

/**
 * @async @desc pull MKR from the proxy freeing it from the voting contracts
 * @param {Object} { account, value }
 * @return {Promise} tx
 */
export const proxyFree = async ({ account, value }) => {
  if (!account.hasProxy)
    throw new Error(
      `${account.address} cannot free because account doesn't have a proxy`
    );
  const { address: proxyAddress } = account.proxy;
  return simpleSendTx(account, proxyAddress, 'free(uint256)', [
    ['uint256', etherToWei(value)]
  ]);
};

//check balance, then free that amount
export const proxyFreeAll = async ({ account }) => {
  if (!account.hasProxy)
    throw new Error(
      `${account.address} cannot free because account doesn't have a proxy`
    );
  const { address: proxyAddress } = account.proxy;
  const mkrBalance = await getNumDeposits(account.proxy.address);
  return simpleSendTx(account, proxyAddress, 'free(uint256)', [
    ['uint256', etherToWei(mkrBalance)]
  ]);
};
