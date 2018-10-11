import {
  getNetworkName,
  setWeb3Network,
  setWeb3Provider,
  getChief,
  getWeb3Instance,
  encodeParameter
} from '../src/web3';
import FakeProvider from 'web3-fake-provider';
import { useGanache } from './helpers';

test('singleton setup', async () => {
  const provider = new FakeProvider();

  setWeb3Provider(provider);
  provider.injectResult('42');
  let name = await getNetworkName();
  expect(name).toEqual('kovan');

  provider.injectResult('1');
  setWeb3Provider(provider);
  name = await getNetworkName();
  expect(name).toEqual('mainnet');
});

test('getNetworkName', async () => {
  useGanache();
  const name = await getNetworkName();
  expect(name).toEqual('ganache');
});

test('getChief', async () => {
  const provider = new FakeProvider();
  setWeb3Provider(provider);
  provider.injectResult('42');
  const kovanAddr = await getChief();

  useGanache();
  const ganacheAddr = await getChief();
  expect(kovanAddr).not.toEqual(ganacheAddr);
});

test('setWeb3Network', () => {
  setWeb3Network('kovan');
  expect(getWeb3Instance().currentProvider.host).toEqual(
    'https://kovan.infura.io/'
  );

  setWeb3Network('mainnet');
  expect(getWeb3Instance().currentProvider.host).toEqual(
    'https://mainnet.infura.io/'
  );
});

test('parameter encoding', () => {
  const value = encodeParameter('uint256', 7, true);
  const expected =
    '0000000000000000000000000000000000000000000000000000000000000007';
  expect(value).toEqual(expected);
});
