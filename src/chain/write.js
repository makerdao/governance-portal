//////////////////////////////////////////////////////////
//// Sign & send transactions to the ethereum network ////
//////////////////////////////////////////////////////////

import {
  getTxDetails,
  getMethodSig,
  getProxyFactory,
  getMkrAddress,
  getChief,
  encodeParameter,
  sendSignedTx
} from "./web3";
import { getProxyStatus } from "./read";
import {
  generateCallData,
  removeHexPrefix,
  stringToHex,
  etherToWei
} from "../utils/ethereum";
import ledgerSubprovider from "./ledger";

/**
 * @desc metamask send transaction
 * @param  {Object} transaction { from, to, value, data, gasPrice, gasLimit }
 * @return {Promise} tx
 */
export const metamaskSendTx = transaction =>
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
 * @desc ledger send transaction
 * @param  {Object}  transaction { from, to, value, data, gasPrice}
 * @return {Promise}
 */
export const ledgerSendTransaction = transaction =>
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
  console.log(type);
  switch (type) {
    case "METAMASK":
      return metamaskSendTx(tranasction);
    case "LEDGER":
      return ledgerSendTransaction(tranasction);
    default:
      return metamaskSendTx(tranasction);
  }
};

/**
 * @async @desc initate vote-proxy link
 * @param  {Object} wallets { acccount: { address, type }, hot }
 * @return {Promise} tx
 */
export const initateLink = async ({ account, hot }) => {
  const cold = account.address;
  const factory = await getProxyFactory();
  const methodSig = getMethodSig("initiateLink(address)");
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(hot)]
  });
  const tx = { to: factory, from: cold, data: callData };
  return sendTransactionMulti(account.type, tx);
};

/**
 * @async @desc approve vote-proxy link
 * @param  {Object} wallets { acccount: { address, type }, hot }
 * @return {Promise} tx
 */
export const approveLink = async ({ account, cold }) => {
  const hot = account.address;
  const factory = await getProxyFactory();
  const methodSig = getMethodSig("approveLink(address)");
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(cold)]
  });
  const tx = { to: factory, from: hot, data: callData };
  return sendTransactionMulti(account.type, tx);
};

/**
 * @async @desc transfer Mkr to this address's proxy
 * @param  {Object} transferDetails { acccount: { address, type }, value }
 * @return {Promise} tx
 */
export const sendMkrToProxy = async ({ account, value }) => {
  const { proxy } = await getProxyStatus(account.address);
  const mkrToken = await getMkrAddress();
  const methodSig = getMethodSig("transfer(address,uint256)");
  // TODO error handle if isCold is false
  const weiAmtHex = stringToHex(etherToWei(value));
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proxy), removeHexPrefix(weiAmtHex)]
  });
  const tx = { to: mkrToken, from: account.address, data: callData };
  return sendTransactionMulti(account.type, tx);
};

/**
 * @async @desc vote for a single proposal (in the form of an address)
 * @param {Object} voteDetails { acccount: { address, type }, proposal }
 * @return {Promise} tx
 */
export const voteProposal = async ({ account, proposalAddress }) => {
  const chief = await getChief();
  const methodSig = getMethodSig("vote(address[])");
  const proposalParam = encodeParameter("address[]", [proposalAddress]);
  const callData = generateCallData({
    method: methodSig,
    args: [removeHexPrefix(proposalParam)]
  });
  const tx = { to: chief, from: account.address, data: callData };
  return sendTransactionMulti(account.type, tx);
};
