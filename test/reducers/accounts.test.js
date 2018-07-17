import reducer, { updateAccount } from '../../src/reducers/accounts';

test('UPDATE_ACCOUNT preserves unchanged values', () => {
  const state = {
    allAccounts: [
      {
        address: '0xf00',
        type: 'TEST',
        balance: 100,
        magic: true
      }
    ]
  };

  const action = updateAccount({
    address: '0xf00',
    type: 'TEST',
    balance: 98
  });

  const newState = reducer(state, action);
  expect(newState.allAccounts[0]).toEqual({
    address: '0xf00',
    type: 'TEST',
    balance: 98,
    magic: true
  });
});
