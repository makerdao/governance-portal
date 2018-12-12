import TestChainService from '../src/TestChainService';
import { setupTestMakerInstance } from './helpers';

let maker;

beforeAll(async () => {
  maker = await setupTestMakerInstance();
});

test('can create TestchainService', async () => {
  const testchainService = maker.service('testchain');
  expect(testchainService).toBeInstanceOf(TestChainService);
});

test('hello world', async () => {
  const testchainService = maker.service('testchain');
  const world = 'worlds';
  const hello = testchainService.testServiceMethod(world);
  const expected = `hello ${world}`;
  console.log(hello);
  expect(hello).toBe(expected);
});
