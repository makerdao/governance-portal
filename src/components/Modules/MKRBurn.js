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
import BurnMkrModal from './Burn/BurnMkrModal';
import InitiateShutdownModal from './InitiateShutdown/InitiateShutdownModal';

const Filler = styled.div`
  border-radius: inherit;
  height: 100%;
  transition: width 0.2s ease-in;
  background-color: #f75625;
  min-height: 20px;
`;

const MKRBurn = ({
  totalMkrInEsm,
  account,
  esmThresholdAmount,
  initiated,
  canInitiate
}) => {
  const accountMkrInEsm = account.mkrInEsm;
  const [burnAmount, setBurnAmount] = useState('');
  const [txHash, setTxHash] = useState('');
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

  const ModalTriggerBurn = ({ text, onOpen, buttonRef }) => (
    <Button variant="danger-outline" onClick={onOpen} ref={buttonRef}>
      {text}
    </Button>
  );
  const ModalTriggerInitiate = ({ text, onOpen, buttonRef, canInitiate }) => (
    <Button
      variant="danger-outline"
      onClick={onOpen}
      ref={buttonRef}
      disabled={!canInitiate}
    >
      {text}
    </Button>
  );

  const modalProps =
    totalMkrInEsm && totalMkrInEsm.lt(esmThresholdAmount)
      ? {
          triggerText: 'Burn your MKR',
          ariaLabel:
            'Modal to confirm burning your MKR for an emergency shutdown',
          ModalTrigger: ModalTriggerBurn
        }
      : {
          triggerText: 'Initiate Emergency Shutdown',
          ariaLabel: 'Modal to confirm initiation of emergency shutdown',
          ModalTrigger: ModalTriggerInitiate
        };

  const contentProps = {
    account,
    burnAmount,
    setBurnAmount,
    step,
    setStep,
    depositsInChief,
    totalMkrInEsm,
    esmThresholdAmount,
    txHash,
    setTxHash,
    canInitiate
  };
  const burnModal = props => <BurnMkrModal {...props} />;
  const initiateModal = props => <InitiateShutdownModal {...props} />;
  const modal =
    totalMkrInEsm && totalMkrInEsm.lt(esmThresholdAmount)
      ? burnModal
      : initiateModal;

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
                      totalMkrInEsm.gte(esmThresholdAmount)
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
            {totalMkrInEsm ? (
              <ModalPortal {...modalProps} {...contentProps}>
                {modal}
              </ModalPortal>
            ) : (
              <Box pl="14px" pr="14px">
                <Loader size={20} color="header" background="white" />
              </Box>
            )}
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
