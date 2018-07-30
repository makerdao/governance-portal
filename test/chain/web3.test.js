import {
  getNetworkName,
  setWeb3Provider,
  getChief
} from '../../src/chain/web3';
import FakeProvider from 'web3-fake-provider';

test('singleton error message', async () => {
  expect.assertions(1);
  try {
    await getNetworkName();
  } catch (err) {
    expect(err.message).toMatch(/web3Instance was not initialized/);
  }
});

test('singleton setup', async () => {
  const provider = new FakeProvider();
  setWeb3Provider(provider);
  provider.injectResult('42');
  let name = await getNetworkName();
  expect(name).toEqual('kovan');

  provider.injectResult('1');
  name = await getNetworkName();
  expect(name).toEqual('mainnet');
});

test('getNetworkName', async () => {
  setWeb3Provider('http://127.0.0.1:2000');
  const name = await getNetworkName();
  expect(name).toEqual('ganache');
});

test('getChief', async () => {
  const provider = new FakeProvider();
  setWeb3Provider(provider);
  provider.injectResult('42');
  const kovanAddr = await getChief();

  setWeb3Provider('http://127.0.0.1:2000');
  const ganacheAddr = await getChief();
  expect(kovanAddr).not.toEqual(ganacheAddr);
});
