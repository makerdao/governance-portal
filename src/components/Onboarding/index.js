import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import {
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep,
  onboardingSkipProxy,
  onboardingToStep,
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
import SingleWallet from './SingleWallet';

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

const Onboarding = ({ open, step, state, ...props }) => {
  const onboardingProps = {
    close: props.onboardingClose,
    nextStep: props.onboardingNextStep,
    prevStep: props.onboardingPrevStep,
    toStep: props.onboardingToStep,
    setState: props.setOnboardingState,
    skipPoxy: props.onboardingSkipProxy
  };

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
          onboardingProps.setState(OnboardingStates.SETUP_LINKED_WALLET)
        }
        onSingleWallet={() =>
          onboardingProps.setState(OnboardingStates.SETUP_SINGLE_WALLET)
        }
      />
      {state === OnboardingStates.SETUP_LINKED_WALLET ? (
        <ProxyOnboarding step={step} open={open} onboarding={onboardingProps} />
      ) : null}

      {state === OnboardingStates.SETUP_SINGLE_WALLET ? (
        <SingleWalletOnboarding
          step={step}
          open={open}
          onboarding={onboardingProps}
        />
      ) : null}
    </Background>
  );
};

const ProxyOnboarding = ({ open, step, onboarding }) => {
  return (
    <OnboardingFullScreen
      step={step}
      show={open}
      onClose={onboarding.close}
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
        onCancel={() => onboarding.setState(OnboardingStates.INTRODUCTION)}
        onComplete={onboarding.nextStep}
      />
      <ChooseHotWallet onComplete={onboarding.nextStep} />
      <ChooseColdWallet
        onComplete={onboarding.nextStep}
        onCancel={onboarding.prevStep}
      />
      <InitiateLink
        onComplete={onboarding.nextStep}
        onCancel={onboarding.prevStep}
      />
      <LockMKR onComplete={onboarding.nextStep} />
      <StartVoting
        onComplete={() => {
          onboarding.close();
          onboarding.setState(OnboardingStates.FINISHED);
        }}
      />
    </OnboardingFullScreen>
  );
};

const SingleWalletOnboarding = ({ open, step, onboarding }) => {
  return (
    <OnboardingFullScreen
      step={step}
      show={open}
      onClose={onboarding.close}
      steps={['Terms of use', 'Grant Approval', 'Lock MKR', 'Start Voting']}
    >
      <Terms
        onCancel={() => onboarding.setState(OnboardingStates.INTRODUCTION)}
        onComplete={onboarding.nextStep}
      />
      <SingleWallet
        onComplete={() => onboarding.skipPoxy({ step: 2 })}
        onCancel={onboarding.prevStep}
      />
      <LockMKR onComplete={onboarding.nextStep} />
      <StartVoting
        onComplete={() => {
          onboarding.close();
          onboarding.setState(OnboardingStates.FINISHED);
        }}
      />
    </OnboardingFullScreen>
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
    onboardingSkipProxy,
    onboardingToStep
  }
)(Onboarding);
