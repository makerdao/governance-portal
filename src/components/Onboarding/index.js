import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import {
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep,
  onboardingSkipProxy,
  setOnboardingState,
  OnboardingStates
} from '../../reducers/onboarding';
import Terms from './Terms';
import ChooseHotWallet from './ChooseHotWallet';
import ChooseColdWallet from './ChooseColdWallet';
import Introduction from './Introduction';
import InitiateLink from './InitiateLink';
import LockMKR from './LockMKR';
import StartVoting from './StartVoting';

import { OnboardingFullScreen, Box } from '@makerdao/ui-components';

const Background = styled(Box)`
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease-in-out;
  transition-delay: 0.2s;

  ${props =>
    props.show &&
    `
    pointer-events: unset;
    opacity: 1;
    transition-delay: 0s;
  `};
`;

const Onboarding = ({
  open,
  step,
  state,
  hotWalletAddress,
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep,
  onboardingSkipProxy,
  setOnboardingState,
  setHotWallet
}) => {
  return (
    <Background
      show={open}
      zIndex="2"
      bg="backgroundGrey"
      position="fixed"
      height="100%"
      width="100%"
      top="0"
      left="0"
    >
      <Introduction
        show={open && state === OnboardingStates.INTRODUCTION}
        onClose={onboardingClose}
        onLinkedWallet={() =>
          setOnboardingState(OnboardingStates.SETUP_LINKED_WALLET)
        }
      />
      <OnboardingFullScreen
        step={step}
        show={open && state === OnboardingStates.SETUP_LINKED_WALLET}
        onClose={onboardingClose}
        steps={[
          'Terms of use',
          'Select Voting Wallet',
          'Select MKR Balance',
          'Initiate Link',
          'Lock MKR',
          'Start Voting'
        ]}
      >
        <Terms
          onCancel={() => setOnboardingState(OnboardingStates.INTRODUCTION)}
          onComplete={onboardingNextStep}
        />

        <ChooseHotWallet
          onComplete={onboardingNextStep}
          onSkipProxy={onboardingSkipProxy}
        />
        <ChooseColdWallet
          onComplete={onboardingNextStep}
          onCancel={onboardingPrevStep}
        />
        <InitiateLink
          onComplete={onboardingNextStep}
          onCancel={onboardingPrevStep}
        />
        <LockMKR onComplete={onboardingNextStep} />
        <StartVoting
          onComplete={() => {
            onboardingClose();
            setOnboardingState(OnboardingStates.FINISHED);
          }}
        />
      </OnboardingFullScreen>
    </Background>
  );
};

export default connect(
  state => ({
    ...state.onboarding
  }),
  {
    setOnboardingState,
    onboardingClose,
    onboardingNextStep,
    onboardingPrevStep,
    onboardingSkipProxy
  }
)(Onboarding);
