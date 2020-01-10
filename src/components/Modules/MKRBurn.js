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
  Link
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
  const Step0 = ({ onClose }) => {
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
          <Button variant="danger" ml={'s'}>
            Continue
          </Button>
        </Flex>
      </Fragment>
    );
  };
  // const step1
  // const step2
  // const step3

  const ModalContent = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const renderStep = step => {
      switch (step) {
        case 0:
          return <Step0 onClose={onClose} />;
        // case 1:
        //   return <Step1 />
        // case 2:
        //   return <Step2 />
        // case 3:
        //   return <Step3 />
        default:
          return <Step0 />;
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
              <ModalContent />
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
