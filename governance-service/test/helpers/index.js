import { setWeb3Provider } from '../../src/web3';
import fetch from 'node-fetch';

function ganacheAddress() {
  const port = process.env.GOV_TESTNET_PORT || 2000;
  return `http://localhost:${port}`;
}

export function useGanache() {
  setWeb3Provider(ganacheAddress());
}

let requestCount = 0;

export async function takeSnapshot() {
  const id = requestCount;
  requestCount += 1;

  const res = await fetch(ganacheAddress(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'evm_snapshot',
      params: [],
      id: id
    })
  });

  const json = await res.json();
  return parseInt(json['result'], 16);
}

export async function restoreSnapshot(snapId) {
  const id = requestCount;
  requestCount += 1;

  const res = await fetch(ganacheAddress(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'evm_revert',
      params: [snapId],
      id: id
    })
  });

  const json = await res.json();
  return json['result'];
}

export const fakeAddresses = ['0xbeefed1bedded2dabbed3defaced4decade5dead'];

// some of the accounts that're generated from the mnemonic we give ganache
export const ganacheAccounts = [
  { address: '0xda1495ebd7573d8e7f860862baa3abecebfa02e0', type: 'GANACHE' },
  { address: '0x81431b69b1e0e334d4161a13c2955e0f3599381e', type: 'GANACHE' },
  { address: '0xb76a5a26ba0041eca3edc28a992e4eb65a3b3d05', type: 'GANACHE' }
];
export const ganacheCoinbase = {
  address: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6',
  type: 'GANACHE'
};
// ^ our default coinbase BUT we should probably avoid using it for
// tests (besides sending mkr) since it's the address the contracts are deployed
// from on ganache, so it has special privledges that could affect test results
