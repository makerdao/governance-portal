import each from 'jest-each';
import reducer, {
  OnboardingStates,
  onboardingOpen,
  onboardingClose,
  onboardingToStep,
  onboardingNextStep,
  onboardingPrevStep,
  setHotWallet,
  resetHotWallet,
  setColdWallet,
  resetColdWallet,
  setOnboardingState
} from '../../src/reducers/onboarding';

import { SET_ACTIVE_ACCOUNT } from '../../src/reducers/accounts';

test('onboardingOpen open onboarding', () => {
  const state = {
    open: false
  };

  const action = onboardingOpen();

  const newState = reducer(state, action);
  expect(newState.open).toEqual(true);
});

test('onboardingOpen leaves onboarding open if it is open already', () => {
  const state = {
    open: true
  };

  const action = onboardingOpen();

  const newState = reducer(state, action);
  expect(newState.open).toEqual(true);
});

test('onboardingClose closes onboarding', () => {
  const state = {
    open: true
  };

  const action = onboardingClose();

  const newState = reducer(state, action);
  expect(newState.open).toEqual(false);
});

test('onboardingClose leaves onboarding closed if it is closed already', () => {
  const state = {
    open: false
  };

  const action = onboardingClose();

  const newState = reducer(state, action);
  expect(newState.open).toEqual(false);
});

test('onboardingToStep moves onboarding to the specified step', () => {
  const state = {
    step: 6
  };

  const action = onboardingToStep(3);

  const newState = reducer(state, action);
  expect(newState.step).toEqual(3);
});

test('onboardingToStep moves onboarding to the specified step, even if it already on that step', () => {
  const state = {
    step: 3
  };

  const action = onboardingToStep(3);

  const newState = reducer(state, action);
  expect(newState.step).toEqual(3);
});

test('onboardingNextStep moves onboarding to the next step', () => {
  const state = {
    step: 5
  };

  const action = onboardingNextStep();

  const newState = reducer(state, action);
  expect(newState.step).toEqual(6);
});

test('onboardingPrevStep moves onboarding to the previous step', () => {
  const state = {
    step: 5
  };

  const action = onboardingPrevStep();

  const newState = reducer(state, action);
  expect(newState.step).toEqual(4);
});

test('setHotWallet sets the hot wallet to the specified value', () => {
  const state = {
    hotWallet: {
      address: '0xdeadbeef'
    }
  };

  const newHotWallet = {
    address: '0xbeefface'
  };

  const action = setHotWallet(newHotWallet);

  const newState = reducer(state, action);
  expect(newState.hotWallet).toEqual(newHotWallet);
});

test('resetHotWallet sets hotWallet to undefined', () => {
  const state = {
    hotWallet: {
      address: '0xdeadbeef'
    }
  };

  const action = resetHotWallet();

  const newState = reducer(state, action);
  expect(newState.hotWallet).toEqual(undefined);
});

test('resetHotWallet sets hotWallet to undefined, even if it already undefined', () => {
  const state = {
    hotWallet: undefined
  };

  const action = resetHotWallet();

  const newState = reducer(state, action);
  expect(newState.hotWallet).toEqual(undefined);
});

test('setColdWallet sets the cold wallet to the specified value', () => {
  const state = {
    coldWallet: {
      address: '0xdeadbeef'
    }
  };

  const newColdWallet = {
    address: '0xbeefface'
  };

  const action = setColdWallet(newColdWallet);

  const newState = reducer(state, action);
  expect(newState.coldWallet).toEqual(newColdWallet);
});

test('resetColdWallet sets coldWallet to undefined', () => {
  const state = {
    coldWallet: {
      address: '0xdeadbeef'
    }
  };

  const action = resetColdWallet();

  const newState = reducer(state, action);
  expect(newState.coldWallet).toEqual(undefined);
});

test('resetColdWallet sets coldWallet to undefined, even if it already undefined', () => {
  const state = {
    coldWallet: undefined
  };

  const action = resetColdWallet();

  const newState = reducer(state, action);
  expect(newState.coldWallet).toEqual(undefined);
});

test('setOnboardingState sets the onboarding state to the specified onboarding state', () => {
  const state = {
    state: OnboardingStates.SETUP_LINKED_WALLET
  };

  const action = setOnboardingState(OnboardingStates.INTRODUCTION);

  const newState = reducer(state, action);
  expect(newState.state).toEqual(OnboardingStates.INTRODUCTION);
});

const hotAccountAddress = '0xdeadbeef';
const coldAccountAddress = '0xbeefface';
const newAccountAddress = '0xf00dbeef';

describe('When the active account changes to an account we are already onboarding', () => {
  const initialState = {
    step: 3,
    state: OnboardingStates.SETUP_LINKED_WALLET,
    hotWallet: {
      address: hotAccountAddress
    },
    coldWallet: {
      address: coldAccountAddress
    }
  };

  test('nothing changes, if the active account is the hot wallet in the account pair', () => {
    const state = {
      step: 1,
      state: OnboardingStates.FINISHED,
      hotWallet: {
        address: hotAccountAddress
      },
      coldWallet: {
        address: coldAccountAddress
      }
    };

    const newState = reducer(state, {
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: {
          address: hotAccountAddress
        }
      }
    });

    expect(newState).toEqual(state);
  });

  test('nothing changes, if the active account is the cold wallet in the account pair', () => {
    const state = {
      step: 1,
      state: OnboardingStates.FINISHED,
      hotWallet: {
        address: hotAccountAddress
      },
      coldWallet: {
        address: coldAccountAddress
      }
    };

    const newState = reducer(state, {
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: {
          address: coldAccountAddress
        }
      }
    });

    expect(newState).toEqual(state);
  });

  test('nothing changes, if the active account is the hot wallet, and it already has a proxy set up', () => {
    const state = initialState;

    const newState = reducer(state, {
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: {
          address: hotAccountAddress,
          hasProxy: true,
          proxyRole: 'hot',
          proxy: {
            hasInfMkrApproval: false
          }
        }
      }
    });

    expect(newState).toEqual(state);
  });

  test('nothing changes, if the active account is the cold wallet, and it already has a proxy set up', () => {
    const state = initialState;

    const newState = reducer(state, {
      type: SET_ACTIVE_ACCOUNT,
      payload: {
        newAccount: {
          address: coldAccountAddress,
          hasProxy: true,
          proxyRole: 'cold',
          proxy: {
            hasInfMkrApproval: true
          }
        }
      }
    });

    expect(newState).toEqual(state);
  });
});

each([
  [
    1,
    OnboardingStates.SETUP_LINKED_WALLET,
    { address: hotAccountAddress },
    { address: coldAccountAddress }
  ],
  [0, OnboardingStates.INTRODUCTION, undefined, undefined]
]).describe(
  'When the active account changes to a new account',
  (step, state, hotWallet, coldWallet) => {
    const initialState = {
      step,
      state,
      hotWallet,
      coldWallet
    };

    test('reset onboarding to the start, if the account does not have a proxy set up', () => {
      const state = initialState;

      const newState = reducer(state, {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: newAccountAddress,
            hasProxy: false
          }
        }
      });

      expect(newState).toEqual({
        step: 0,
        state: OnboardingStates.INTRODUCTION,
        hotWallet: undefined,
        coldWallet: undefined
      });
    });

    test('set onboarding as finished, if the new account is a hot account, with a proxy set up', () => {
      const state = initialState;

      const newState = reducer(state, {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: newAccountAddress,
            hasProxy: true,
            proxyRole: 'hot'
          }
        }
      });

      expect(newState.state).toEqual(OnboardingStates.FINISHED);
    });

    test('set onboarding as finished, if the active account is a cold account, with a proxy set up, and already has infinite MKR approval', () => {
      const state = initialState;

      const newState = reducer(state, {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: newAccountAddress,
            hasProxy: true,
            proxyRole: 'cold',
            proxy: {
              hasInfMkrApproval: true
            }
          }
        }
      });

      expect(newState.state).toEqual(OnboardingStates.FINISHED);
    });

    test('send the user to approve inf mkr, if the new account is a cold account with a proxy, but without infinite MKR approve', () => {
      const state = {
        ...initialState,
        state: OnboardingStates.FINISHED
      };

      const newState = reducer(state, {
        type: SET_ACTIVE_ACCOUNT,
        payload: {
          newAccount: {
            address: newAccountAddress,
            hasProxy: true,
            proxyRole: 'cold',
            proxy: {
              hasInfMkrApproval: false,
              linkedAccount: {
                address: hotAccountAddress
              }
            }
          }
        }
      });

      expect(newState.step).toEqual(3);
      expect(newState.state).toEqual(OnboardingStates.SETUP_LINKED_WALLET);
      expect(newState.hotWallet.address).toEqual(hotAccountAddress);
      expect(newState.coldWallet.address).toEqual(newAccountAddress);
    });
  }
);
