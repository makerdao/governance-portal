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
      case 3:
        return (
          <Step1
            txHash={txHash}
            onClose={onClose}
            title={'Emergency Shutdown is being initiated'}
          />
        );
      case 4:
        return (
          <Step2
            title={'Emergency Shutdown Tx Failed'}
            txHash={txHash}
            onClose={onClose}
          />
        );

      // return (
      //   <Step1
      //     onClose={onClose}
      //     onContinue={setStep}
      //     mkrBalance={account.mkrBalance}
      //     update={setBurnAmount}
      //     value={burnAmount}
      //     deposits={depositsInChief}
      //   />
      // );
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
