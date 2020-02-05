import React from 'react';
import { Flex } from '@makerdao/ui-components-core';
import Step0 from './Step0';
import Step1 from '../InProgress';
import Step2 from '../Failed';

export default props => {
  const {
    step,
    setStep,
    onClose,
    esmThresholdAmount,
    setTxHash,
    txHash
  } = props;
  const renderStep = step => {
    switch (step) {
      case 0:
        return (
          <Step0
            onClose={onClose}
            setStep={setStep}
            esmThresholdAmount={esmThresholdAmount}
            setTxHash={setTxHash}
          />
        );
      case 1:
        return (
          <Step1
            txHash={txHash}
            onClose={onClose}
            title={'Emergency Shutdown is being initiated'}
          />
        );
      case 2:
        return (
          <Step2
            title={'Emergency Shutdown Tx Failed'}
            txHash={txHash}
            onClose={onClose}
          />
        );
      default:
        return <div />;
    }
  };
  const renderedStep = renderStep(step);
  return (
    <Flex flexDirection="column" alignItems="center">
      {renderedStep}
    </Flex>
  );
};
