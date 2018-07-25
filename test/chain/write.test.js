import { encodeArgument } from '../../src/chain/write';
import FakeProvider from 'web3-fake-provider';
import { setWeb3Provider } from '../../src/chain/web3';

beforeAll(() => setWeb3Provider(new FakeProvider()));

test('parameter encoding', () => {
  const value = encodeArgument('uint256', 7);
  const expected =
    '0000000000000000000000000000000000000000000000000000000000000007';
  expect(value).toEqual(expected);
});
