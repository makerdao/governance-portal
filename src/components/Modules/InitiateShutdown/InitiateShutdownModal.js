import React from 'react';
import { Flex } from '@makerdao/ui-components-core';

export default props => {
  const { step } = props;
  const renderStep = step => {
    switch (step) {
      case 0:
        break;
      // return <Step0 onClose={onClose} onContinue={setStep} />;
      case 1:
        break;
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
