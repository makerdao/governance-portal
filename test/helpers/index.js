import { setWeb3Provider } from '../../src/chain/web3';

export function useGanache() {
  setWeb3Provider('http://127.0.0.1:2000');
}

export const fakeAddresses = ['0xbeefed1bedded2dabbed3defaced4decade5dead'];
