import { getNetworkName, setWeb3Provider } from '../../src/chain/web3';
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
