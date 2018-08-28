import { getProxyStatus, getMkrBalance } from '../../src/chain/read';
import {
  sendMkrToProxy,
  initiateLink,
  approveLink,
  breakLink,
  sendMkr
} from '../../src/chain/write';
import { useGanache, ganacheAccounts, ganacheCoinbase } from '../helpers';

beforeAll(() => {
  useGanache();
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

test('can create a link, send mkr to generated proxy, and cannot break a link w mkr in it', async () => {
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
  const _cold = { ...cold, proxy: { address: proxyAddress }, hasProxy: true };
  expect(hasProxy).toBeTruthy();

  await sendMkrToProxy({ account: _cold, value: '5' });
  const proxyBalance = await getMkrBalance(proxyAddress);
  expect(proxyBalance).toEqual('5');
  let message;
  try {
    await breakLink(_cold);
  } catch (error) {
    message = error.message || error;
  }
  expect(message).toBeTruthy();
});
