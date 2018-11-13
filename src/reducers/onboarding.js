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

export const onboardingSetHotWallet = address => ({
  type: ONBOARDING_SET_HOT_WALLET,
  payload: {
    address
  }
});

export const onboardingSetColdWallet = address => ({
  type: ONBOARDING_SET_COLD_WALLET,
  payload: {
    address
  }
});

// Reducer ------------------------------------------------

const initialState = {
  step: 2,
  open: true,
  flow: 'linked',
  hotWalletAddress: null,
  coldWalletAddress: null
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
    hotWalletAddress: payload.address
  }),
  [ONBOARDING_SET_COLD_WALLET]: (state, { payload }) => ({
    ...state,
    coldWalletAddress: payload.address
  })
});

export default onboarding;
