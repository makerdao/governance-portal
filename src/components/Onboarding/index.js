import React, { useEffect } from 'react';
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

import { Box } from '@makerdao/ui-components-core';
import OnboardingFullScreen from '@makerdao/ui-components-onboarding';
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

const Onboarding = ({ open, step, state, hideClose, v2, ...props }) => {
  const onboardingProps = {
    close: props.onboardingClose,
    nextStep: props.onboardingNextStep,
    prevStep: props.onboardingPrevStep,
    toStep: props.onboardingToStep,
    setState: props.setOnboardingState,
    skipProxy: props.onboardingSkipProxy
  };

  return (
    <Background
      style={{ top: '0px', left: '0px' }}
      show={open}
      zIndex="2"
      bg="coolGrey.100"
      position="fixed"
      height="100%"
      width="100%"
    >
      <Introduction
        show={open && state === OnboardingStates.INTRODUCTION}
        onClose={onboardingProps.close}
        activeAccountType={props.activeAccountType}
        onLinkedWallet={() =>
          onboardingProps.setState(OnboardingStates.SETUP_LINKED_WALLET)
        }
        onSingleWallet={() =>
          onboardingProps.setState(OnboardingStates.SETUP_SINGLE_WALLET)
        }
      />
      {open && state === OnboardingStates.SETUP_LINKED_WALLET ? (
        <ProxyOnboarding
          step={step}
          open={open}
          onboarding={onboardingProps}
          hideClose={hideClose}
          v2={v2}
        />
      ) : open && state === OnboardingStates.SETUP_SINGLE_WALLET ? (
        <SingleWalletOnboarding
          step={step}
          open={open}
          onboarding={onboardingProps}
        />
      ) : null}
    </Background>
  );
};

const ProxyOnboarding = ({ open, step, onboarding, hideClose, v2 }) => {
  // please forgive this egregious hack
  useEffect(() => {
    if (!hideClose) return;
    for (var x of document.getElementsByClassName(
      'indexesm__HeaderButtons-oxosae-0'
    )) {
      x.style.display = 'none';
    }
  }, [hideClose]);

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
        buttonTitle={v2 ? 'Return to vote.makerdao.com' : undefined}
        onComplete={() => {
          if (v2) {
            window.location = 'https://vote.makerdao.com/executive';
            return;
          }
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
        onComplete={() => onboarding.skipProxy({ step: 2 })}
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
    ...state.onboarding,
    ...state.accounts
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

export const ProxySetup = connect(
  state => ({
    ...state.onboarding,
    ...state.accounts,
    state: OnboardingStates.SETUP_LINKED_WALLET,
    open: true,
    hideClose: true,
    v2: true
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
