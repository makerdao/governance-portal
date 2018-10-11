import { getProxyStatus, getMkrBalance, hasInfMkrApproval } from '../src/read';
import {
  initiateLink,
  approveLink,
  breakLink,
  sendMkr,
  mkrApprove,
  proxyLock
} from '../src/write';
import {
  useGanache,
  takeSnapshot,
  restoreSnapshot,
  ganacheAccounts,
  ganacheCoinbase
} from './helpers';

// TODO: figure out where to put helpers

let snapshotId = null;

beforeAll(() => {
  useGanache();
});

beforeEach(async () => {
  snapshotId = await takeSnapshot();
});

afterEach(async () => {
  await restoreSnapshot(snapshotId);
});

const linkAccounts = async (cold, hot) => {
  await initiateLink({
    coldAccount: cold,
    hotAddress: hot.address
  });
  await approveLink({
    hotAccount: hot,
    coldAddress: cold.address
  });
};

test('can create and break a link', async () => {
  const cold = ganacheAccounts[0];
  const hot = ganacheAccounts[1];
  await linkAccounts(cold, hot);

  const { hasProxy: hasProxyPreBreak } = await getProxyStatus(cold.address);
  expect(hasProxyPreBreak).toBeTruthy();
  await breakLink(cold); // ~~ Break. That. Link. ~~
  const { hasProxy: hasProxyPostBreak } = await getProxyStatus(cold.address);
  expect(hasProxyPostBreak).toBeFalsy();
});

test.skip('can create a link, send mkr to generated proxy, and cannot break a link w mkr in it', async () => {
  const cold = ganacheAccounts[0];
  const hot = ganacheAccounts[1];
  await sendMkr({
    account: ganacheCoinbase,
    recipientAddress: cold.address,
    value: '5'
  });
  await linkAccounts(cold, hot);

  const { hasProxy, address: proxyAddress } = await getProxyStatus(
    cold.address
  );
  expect(hasProxy).toBeTruthy();
  const _cold = { ...cold, proxy: { address: proxyAddress }, hasProxy: true };

  await mkrApprove(_cold, proxyAddress);
  const hasApprovals = await hasInfMkrApproval(_cold.address, proxyAddress);
  expect(hasApprovals).toEqual(true);
  await proxyLock({ account: _cold, value: '5' });
  const deposits = await getNumDeposits(proxyAddress);
  expect(deposits).toEqual('5');
  let message;
  try {
    await breakLink(_cold);
  } catch (error) {
    message = error.message || error;
  }
  expect(message).toBeTruthy();
});
