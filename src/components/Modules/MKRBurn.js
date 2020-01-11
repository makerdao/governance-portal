import React, { Fragment, useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Text,
  Link,
  Input
} from '@makerdao/ui-components-core';
import ModalPortal from '../ModalPortal';
import warning from '../../imgs/warning.svg';

const WarningIcon = styled.p`
  width: 63px;
  height: 57px;
  background-color: #f77249;
  mask: url(${warning}) center no-repeat;
`;

export default () => {
  const ModalTrigger = ({ text, onOpen, buttonRef }) => (
    <Button variant="danger-outline" onClick={onOpen} innerRef={buttonRef}>
      {text}
    </Button>
  );
  const Step0 = ({ onClose, onContinue }) => {
    return (
      <Fragment>
        <WarningIcon />
        <Text.h2 mt="m">Are you sure you want to burn MKR?</Text.h2>
        <Text.p mt="m" mx="l" textAlign="center">
          {`By burning your MKR in the ESM, you are contributing to the
           shutdown of the Dai Credit System. Your MKR will be immediately burned
            and cannot be retrieved.`}
          {` `}
          <Link
            target="_blank"
            rel="noopener noreferrer"
            css="text-decoration: none"
          >
            Read the ESM documentation.
          </Link>
        </Text.p>
        <Flex flexDirection="row" justifyContent="space-around" m={'m'}>
          <Button
            variant="secondary-outline"
            color="black"
            onClick={onClose}
            mr={'s'}
          >
            Cancel
          </Button>
          <Button variant="danger" ml={'s'} onClick={() => onContinue(1)}>
            Continue
          </Button>
        </Flex>
      </Fragment>
    );
  };

  const Step1 = ({ onClose, onContinue }) => {
    const [mkrBalance, setMkrBalance] = useState(0);
    return (
      <Grid gridRowGap="m" justifyContent="center">
        <Text.h2 mt="m" textAlign="center">
          Burn your MKR in the ESM
        </Text.h2>
        <Grid gridRowGap="s" width={'30em'} border="1px solid #D4D9E1">
          <Text.h5 textAlign="left" mt="m" ml="m" fontWeight="500">
            Enter the amount of MKR to burn.
          </Text.h5>
          <Input
            mx={'m'}
            after={
              <button
                css="text-decoration:none"
                style={{ color: '#447AFB', fontSize: 15, fontWeight: '500' }}
              >
                Set Max
              </button>
            }
          />
          <Flex flexDirection="row" ml="m" alignItems="center" mb="m">
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 11,
                color: '#708390',
                lineHeight: 1
              }}
            >
              MKR BALANCE IN WALLET
            </Text>
            <Text
              t="caption"
              ml="s"
              style={{ fontSize: 14, color: '#48495F', lineHeight: 1 }}
            >
              {`${mkrBalance.toFixed(2)} MKR`}
            </Text>
          </Flex>
        </Grid>
        <Flex flexDirection="row" justifyContent="center" m={'m'}>
          <Button
            variant="secondary-outline"
            color="black"
            onClick={onClose}
            mr="s"
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onContinue(2)} ml="s">
            Continue
          </Button>
        </Flex>
      </Grid>
    );
  };
  const Step2 = ({ onClose, onContinue }) => {
    const [mkrBalance, setMkrBalance] = useState(0);
    return (
      <Grid gridRowGap="m" justifyContent="center">
        <Text.h2 mt="m" textAlign="center">
          Burn your MKR in the ESM
        </Text.h2>
        <Flex flexDirection="row" justifyContent="center" m={'m'}>
          <Button
            variant="secondary-outline"
            color="black"
            onClick={() => {
              onContinue(1);
            }}
            mr="s"
          >
            Back
          </Button>
          <Button variant="danger" onClick={() => onContinue(2)} ml="s">
            Burn MKR
          </Button>
        </Flex>
      </Grid>
    );
  };
  // const step3

  const ModalContent = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const renderStep = step => {
      switch (step) {
        case 0:
          return <Step0 onClose={onClose} onContinue={setStep} />;
        case 1:
          return <Step1 onClose={onClose} onContinue={setStep} />;
        case 2:
          return <Step2 onContinue={setStep} />;
        // case 3:
        //   return <Step3 />
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

  const modalProps = {
    triggerText: 'Burn your MKR',
    ariaLabel: 'Modal to confirm burning your MKR for an emergency shutdown',
    ModalTrigger
  };
  const [mkrStaked, setMkrStaked] = useState('0.00');
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        Total MKR Burned
      </Text.h4>
      <Card>
        <CardBody p={'s'} pb={'m'}>
          <Flex flexDirection="row" m={'s'}>
            {/* Load Number */}
            <Text.h3>
              {`${mkrStaked} MKR `}
              {` `}
            </Text.h3>
            <Text.p color="#708390" ml="xs" fontWeight="400">
              {' '}
              of 50,000 MKR
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
          ></Box>
        </CardBody>
        <CardBody>
          <Flex flexDirection="row" justifyContent="space-between" m={'m'}>
            <ModalPortal {...modalProps}>
              {onClose => (
                <Fragment>
                  <ModalContent onClose={onClose} />
                </Fragment>
              )}
            </ModalPortal>
            <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
              You have no MKR in the ESM
            </Text.p>
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};
