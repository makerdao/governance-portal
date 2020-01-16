import React from 'react';
import { Flex } from '@makerdao/ui-components-core';
import Step0 from './Step0';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

export default props => {
  const {
    onClose,
    account,
    burnAmount,
    setBurnAmount,
    depositsInChief,
    step,
    setStep,
    totalMkrInEsm,
    burnTxHash,
    setBurnTxHash
  } = props;
  const renderStep = step => {
    switch (step) {
      case 0:
        return <Step0 onClose={onClose} onContinue={setStep} />;
      case 1:
        return (
          <Step1
            onClose={onClose}
            onContinue={setStep}
            mkrBalance={account.mkrBalance}
            update={setBurnAmount}
            value={burnAmount}
            deposits={depositsInChief}
          />
        );
      case 2:
        return (
          <Step2
            setStep={setStep}
            burnAmount={burnAmount}
            totalMkrInEsm={totalMkrInEsm}
            address={account.address}
            setBurnTxHash={setBurnTxHash}
          />
        );
      case 3:
        return <Step3 burnTxHash={burnTxHash} onClose={onClose} />;
      case 4:
        return (
          <Step4
            title={'Burn Tx Failed'}
            burnTxHash={burnTxHash}
            onClose={onClose}
          />
        );
      default:
        return <Step0 onClose={onClose} onContinue={setStep} />;
    }
  };
  const renderedStep = renderStep(step);
  return (
    <Flex flexDirection="column" alignItems="center">
      {renderedStep}
    </Flex>
  );
};
