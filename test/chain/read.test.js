import {
  getApprovalCount,
  getProxyStatus,
  getVoteTally
} from '../../src/chain/read';
import { useGanache, fakeAddresses } from '../helpers';

beforeAll(() => {
  useGanache();
});

test('getProxyStatus works for an unlinked address', async () => {
  const status = await getProxyStatus(fakeAddresses[0]);
  expect(status).toEqual({
    type: null,
    address: '',
    hasProxy: false
  });
});

test('getApprovalCount', async () => {
  const approvals = await getApprovalCount(fakeAddresses[0]);
  expect(approvals).toEqual('0');
});

test('getVoteTally', async () => {
  const tally = await getVoteTally();
  expect(tally).toEqual({});
});
