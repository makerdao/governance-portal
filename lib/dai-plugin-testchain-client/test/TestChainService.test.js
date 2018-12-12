import TestChainService from '../src/TestChainService';
import { setupTestMakerInstance } from './helpers';

let maker, smartContract, chief, web3, testchain;

const preset = 'test';

beforeAll(async () => {
  maker = await setupTestMakerInstance(preset);
  smartContract = maker.service('smartContract');
  chief = maker.service('chief');
  web3 = maker.service('web3');
  testchain = maker.service('testchain');
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
  const name = 'CHIEF';
  const contract = await smartContract.getContractAddressByName(name);
  console.log(name, 'address', contract);
  // console.log(await chief.getHat());
  console.log('networkId', web3.networkId());
});
