import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

const ONBOARDING_OPEN = 'onboarding/ONBOARDING_OPEN';
const ONBOARDING_CLOSE = 'onboarding/ONBOARDING_CLOSE';
const ONBOARDING_NEXT_STEP = 'onboarding/ONBOARDING_NEXT_STEP';
const ONBOARDING_PREV_STEP = 'onboarding/ONBOARDING_PREV_STEP';
const ONBOARDING_CHOOSE_WALLET = 'onboarding/ONBOARDING_CHOOSE_WALLET';
const ONBOARDING_START_LINKED_FLOW = 'onboarding/ONBOARDING_START_LINKED_FLOW';

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

export const onboardingChooseWallet = () => ({
  type: ONBOARDING_CHOOSE_WALLET
});

export const onboardingStartLinkedFlow = () => ({
  type: ONBOARDING_START_LINKED_FLOW
});

// Reducer ------------------------------------------------

const initialState = { step: 0, open: true, flow: null };

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
  [ONBOARDING_CHOOSE_WALLET]: state => ({
    ...state,
    flow: null
  }),
  [ONBOARDING_START_LINKED_FLOW]: state => ({
    ...state,
    flow: 'linked'
  })
});

export default onboarding;
