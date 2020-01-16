import React, { useState, useEffect } from 'react';
import Loader from '../Loader';
import styled from 'styled-components';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Text
} from '@makerdao/ui-components-core';
import ModalPortal from '../ModalPortal';
import Step0 from './BurnModal/Step0';
import Step1 from './BurnModal/Step1';
import Step2 from './BurnModal/Step2';
import Step3 from './BurnModal/Step3';

// import { etherscanLink } from '../../utils/ui';

const Filler = styled.div`
  border-radius: inherit;
  height: 100%;
  transition: width 0.2s ease-in;
  background-color: #f75625;
  min-height: 20px;
`;

const MKRBurn = ({ totalMkrInEsm, account, esmThresholdAmount }) => {
  const accountMkrInEsm = account.mkrInEsm;
  const [burnAmount, setBurnAmount] = useState('');
  const [step, setStep] = useState(0);
  const [depositsInChief, setDepositsInChief] = useState(0);
  const chief = window.maker.service('chief');

  useEffect(() => {
    (async () => {
      if (typeof account.address !== 'undefined' && chief) {
        const deposits = await chief.getNumDeposits(account.address);
        setDepositsInChief(deposits.toNumber());
      }
    })();
  }, [account, chief]);

  const ModalTrigger = ({ text, onOpen, buttonRef }) => (
    <Button variant="danger-outline" onClick={onOpen} ref={buttonRef}>
      {text}
    </Button>
  );

  const modalProps = {
    triggerText: 'Burn your MKR',
    ariaLabel: 'Modal to confirm burning your MKR for an emergency shutdown',
    ModalTrigger
  };
  const contentProps = {
    account,
    burnAmount,
    setBurnAmount,
    step,
    setStep,
    depositsInChief,
    totalMkrInEsm
  };

  const ModalContent = props => {
    const {
      onClose,
      account,
      burnAmount,
      setBurnAmount,
      depositsInChief
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
              onContinue={setStep}
              burnAmount={burnAmount}
              totalMkrInEsm={totalMkrInEsm}
            />
          );
        case 3:
          return <Step3 onClose={onClose} />;
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

  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        Total MKR Burned
      </Text.h4>
      <Card>
        <CardBody p={'s'} pb={'m'}>
          <Flex flexDirection="row" m={'s'}>
            <Text.h3>
              {totalMkrInEsm ? (
                totalMkrInEsm.toString()
              ) : (
                <Box pl="14px" pr="14px">
                  <Loader size={20} color="header" background="white" />
                </Box>
              )}
            </Text.h3>
            <Text.p color="#708390" ml="xs" fontWeight="400">
              {' '}
              of {esmThresholdAmount ? esmThresholdAmount.toString() : '---'}
            </Text.p>
          </Flex>
          <Box
            flexGrow="1"
            bg="#F6F8F9"
            border="default"
            height="20"
            mx="s"
            my="s"
            mb="m"
            style={{ borderRadius: 5, minHeight: 20 }}
          >
            <Filler
              style={{
                width: totalMkrInEsm
                  ? `${
                      totalMkrInEsm.gt(esmThresholdAmount)
                        ? '100'
                        : totalMkrInEsm
                            .times(100)
                            .div(esmThresholdAmount)
                            .toFixed()
                    }%`
                  : '0%'
              }}
            />
          </Box>
        </CardBody>
        <CardBody>
          <Flex flexDirection="row" justifyContent="space-between" m={'m'}>
            <ModalPortal {...modalProps} {...contentProps}>
              {props => {
                return <ModalContent {...props} />;
              }}
            </ModalPortal>
            <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
              {accountMkrInEsm && accountMkrInEsm.gt(0) ? (
                <Box>
                  You burned{' '}
                  <strong style={{ fontWeight: 'bold' }}>
                    {accountMkrInEsm.toString()}
                  </strong>{' '}
                  in the ESM
                </Box>
              ) : (
                'You have no MKR in the ESM'
              )}
            </Text.p>
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};

export default MKRBurn;
