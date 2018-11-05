import React from 'react';

import { connect } from 'react-redux';
import {
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep
} from '../reducers/onboarding';
import Terms from './onboarding/Terms';
import ChooseHotWallet from './onboarding/ChooseHotWallet';
import Introduction from './onboarding/Introduction';

import { OnboardingFullScreen } from '@makerdao/ui-components';
import metamaskImg from '../imgs/metamask.svg';
import trezorImg from '../imgs/trezor.png';
import ledgerImg from '../imgs/ledger.svg';

const Onboarding = ({
  open,
  step,
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep
}) => {
  return <Introduction />;
  {
    /* <OnboardingFullScreen
      step={step}
      show={open}
      onClose={onboardingClose}
      steps={[
        'Terms',
        'Choose Hot',
        'Choose Cold',
        'Sign Hot TX',
        'Store MKR',
        'Sign Cold TX'
      ]}
    >
      <Terms
        onCancel={onboardingClose}
        onComplete={onboardingNextStep}
      />

      <ChooseHotWallet onComplete={onboardingNextStep}/>
    </OnboardingFullScreen>
    */
  }
};

export default connect(
  state => state.onboarding,
  {
    onboardingClose,
    onboardingNextStep,
    onboardingPrevStep
  }
)(Onboarding);
