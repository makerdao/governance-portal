import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

const ONBOARDING_OPEN = 'onboarding/ONBOARDING_OPEN';
const ONBOARDING_CLOSE = 'onboarding/ONBOARDING_CLOSE';
const ONBOARDING_NEXT_STEP = 'onboarding/ONBOARDING_NEXT_STEP';
const ONBOARDING_PREV_STEP = 'onboarding/ONBOARDING_PREV_STEP';
const ONBOARDING_CHOOSE_WALLET_TYPE =
  'onboarding/ONBOARDING_CHOOSE_WALLET_TYPE';
const ONBOARDING_START_LINKED_FLOW = 'onboarding/ONBOARDING_START_LINKED_FLOW';
const ONBOARDING_SET_HOT_WALLET = 'onboarding/ONBOARDING_SET_HOT_WALLET';
const ONBOARDING_SET_COLD_WALLET = 'onboarding/ONBOARDING_SET_COLD_WALLET';

// Actions ------------------------------------------------

export const onboardingOpen = () => ({
  type: ONBOARDING_OPEN
});

export const onboardingClose = () => ({
  type: ONBOARDING_CLOSE
});

export const onboardingNextStep = () => ({
  type: ONBOARDING_NEXT_STEP
});

export const onboardingPrevStep = () => ({
  type: ONBOARDING_PREV_STEP
});

export const onboardingChooseWalletType = () => ({
  type: ONBOARDING_CHOOSE_WALLET_TYPE
});

export const onboardingStartLinkedFlow = () => ({
  type: ONBOARDING_START_LINKED_FLOW
});

export const setHotWallet = account => ({
  type: ONBOARDING_SET_HOT_WALLET,
  payload: {
    account
  }
});

export const resetHotWallet = () => ({
  type: ONBOARDING_SET_HOT_WALLET,
  payload: {}
});

export const setColdWallet = account => ({
  type: ONBOARDING_SET_COLD_WALLET,
  payload: {
    account
  }
});

export const resetColdWallet = () => ({
  type: ONBOARDING_SET_COLD_WALLET,
  payload: {}
});

// Reducer ------------------------------------------------

const initialState = {
  step: 2,
  open: true,
  flow: 'linked',
  hotWallet: {
    address: '0xd90b1122376F44e3d00a62C409F1b105950869b5',
    type: 'metamask'
  },
  coldWallet: {
    address: '0x1b2bc31a10d8e20f111d9a00aeb5ee96de75a418',
    type: 'trezor'
  },
  connecting: false
};

const onboarding = createReducer(initialState, {
  [ONBOARDING_OPEN]: state => ({
    ...state,
    open: true
  }),
  [ONBOARDING_CLOSE]: state => ({
    ...state,
    open: false
  }),
  [ONBOARDING_NEXT_STEP]: state => ({
    ...state,
    step: state.step + 1
  }),
  [ONBOARDING_PREV_STEP]: state => ({
    ...state,
    step: state.step - 1
  }),
  [ONBOARDING_CHOOSE_WALLET_TYPE]: state => ({
    ...state,
    flow: null
  }),
  [ONBOARDING_START_LINKED_FLOW]: state => ({
    ...state,
    flow: 'linked'
  }),
  [ONBOARDING_SET_HOT_WALLET]: (state, { payload }) => ({
    ...state,
    hotWallet: payload.account
  }),
  [ONBOARDING_SET_COLD_WALLET]: (state, { payload }) => ({
    ...state,
    coldWallet: payload.account
  })
});

export default onboarding;
