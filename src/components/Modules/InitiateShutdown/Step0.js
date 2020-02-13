import React, { Fragment } from 'react';
import styled from 'styled-components';
import warning from '../../../imgs/warning.svg';
import { Button, Flex, Text } from '@makerdao/ui-components-core';

const WarningIcon = styled.p`
  width: 63px;
  height: 57px;
  background-color: #f77249;
  mask: url(${warning}) center no-repeat;
`;

export default ({ onClose, setStep, esmThresholdAmount, setTxHash }) => {
  const maker = window.maker;
  const completeShutdown = async () => {
    try {
      const esm = await maker.service('esm');
      const shutdownTxObject = esm.triggerEmergencyShutdown();
      maker.service('transactionManager').listen(shutdownTxObject, {
        pending: tx => {
          setTxHash(tx.hash);
          setStep(1);
        },
        error: () => setStep(2)
      });
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `shutdown tx failed ${message}`;
      console.error(errMsg);
    }
  };
  return (
    <Fragment>
      <WarningIcon />
      <Text.h2 mt="m">Shutting down the Dai Credit System</Text.h2>
      <Text.p mt="m" mx="l" textAlign="center">
        {`The ${esmThresholdAmount.toNumber()} MKR limit for the emergency shutdown module
        has been reached. By continuing past this alert, emergency shutdown will be initiated
        for the Dai Credit System.`}
      </Text.p>
      <Flex flexDirection="row" justifyContent="center" m={'m'}>
        <Button variant="danger" ml={'s'} onClick={() => completeShutdown()}>
          Initiate Emergency Shutdown
        </Button>
      </Flex>
    </Fragment>
  );
};
