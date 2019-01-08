import TestChainService from '../src/TestChainService';
import { setupTestMakerInstance } from './helpers';

let maker, smartContract, chief, web3, testchain, accounts;

beforeAll(async () => {
  maker = await setupTestMakerInstance();
  smartContract = maker.service('smartContract');
  chief = maker.service('chief');
  web3 = maker.service('web3');
  accounts = maker.service('accounts');
  // testchain = maker.service('testchain');
});

test.only('test', async () => {
  const p = web3.web3Provider();
  console.log('providers', p._providers[1].rpcUrl);
  const act = accounts.getProvider();
  // console.log('accounts.getProvider', act);
});

test('async fetch test', async () => {
  const thing = await testchain.fetchAsyncThing();
  console.log('thing', thing);
});

test('can create TestchainService', async () => {
  const testchainService = maker.service('testchain');
  expect(testchainService).toBeInstanceOf(TestChainService);
});

test('fetchConfigByTestchainId', async () => {
  const id = 999;
  const config = await testchain.fetchConfigByTestchainId(id);
  console.log(config.smartContract.CHIEF.address);
});

test('services', async () => {
  // const name = 'CHIEF';
  const contract = await smartContract.getContractAddressByName(name);
  console.log(name, 'address', contract);
  // console.log(await chief.getHat());
  console.log('networkId', web3.networkId());
});
