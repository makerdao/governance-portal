import reducer, { updateAccount } from '../../src/reducers/accounts';
import {
  SEND_MKR_TO_PROXY_SUCCESS,
  WITHDRAW_MKR_SUCCESS
} from '../../src/reducers/sharedProxyConstants';

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

const state = {
  activeAccount: '0xf00',
  allAccounts: [
    {
      address: '0xf00',
      mkrBalance: '3.1',
      proxy: {
        votingPower: '5.7',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '5.7'
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]
};

test('locking updates account values', () => {
  const action = { type: SEND_MKR_TO_PROXY_SUCCESS, payload: '1.4' };
  const newState = reducer(state, action);
  expect(newState.allAccounts).toEqual([
    {
      address: '0xf00',
      mkrBalance: '1.7',
      proxy: {
        votingPower: '7.1',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '7.1',
        linkedAccount: {
          mkrBalance: '1.7'
        }
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]);
});

test('withdrawing updates account values', () => {
  const action = { type: WITHDRAW_MKR_SUCCESS, payload: '1.4' };
  const newState = reducer(state, action);
  expect(newState.allAccounts).toEqual([
    {
      address: '0xf00',
      mkrBalance: '4.5',
      proxy: {
        votingPower: '4.3',
        linkedAccount: {
          address: '0xbae'
        }
      }
    },
    {
      address: '0xbae',
      mkrBalance: '4.1',
      proxy: {
        votingPower: '4.3',
        linkedAccount: {
          mkrBalance: '4.5'
        }
      }
    },
    {
      address: '0xdead',
      mkrBalance: '1'
    }
  ]);
});
