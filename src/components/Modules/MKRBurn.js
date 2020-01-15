import React, { Fragment, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Text,
  Link,
  Input,
  Checkbox
} from '@makerdao/ui-components-core';
import ModalPortal from '../ModalPortal';
import LoadingToggle from '../LoadingToggle';
import LoadingBar from '../LoadingBar';
import warning from '../../imgs/warning.svg';
import arrowTopRight from '../../imgs/arrowTopRight.svg';
import { etherscanLink } from '../../utils/ui';

const WarningIcon = styled.p`
  width: 63px;
  height: 57px;
  background-color: #f77249;
  mask: url(${warning}) center no-repeat;
`;

const TOSCheck = props => {
  const { hasReadTOS, setHasReadTOS } = props;
  return (
    <Grid alignItems="center" gridTemplateColumns="auto 1fr" {...props}>
      <Checkbox
        ml="s"
        fontSize="l"
        checked={hasReadTOS}
        onChange={() => setHasReadTOS(!hasReadTOS)}
        data-testid={'tosCheck'}
      />
      <Text
        ml="s"
        pl="xs"
        t="caption"
        color="steel"
        onClick={() => setHasReadTOS(!hasReadTOS)}
      >
        I have read and accept the{' '}
        <Link target="_blank" href="/terms">
          Terms of Service
        </Link>
        .
      </Text>
    </Grid>
  );
};

export default () => {
  const ModalTrigger = ({ text, onOpen, buttonRef }) => (
    <Button variant="danger-outline" onClick={onOpen} ref={buttonRef}>
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
  const Step2 = ({ onContinue }) => {
    const [burnAmount, setBurnAmount] = useState(0);
    const [esmTotal, setEsmTotal] = useState(0);
    const [hasReadTOS, setHasReadTOS] = useState(false);
    const [mkrApprovePending, setMkrApprovePending] = useState(false);
    const [proxyDetails, setProxyDetails] = useState({});
    const giveProxyMkrAllowance = async () => {
      // setMkrApprovePending(true);
      // try {
      //   await maker
      //     .getToken(MKR)
      //     .approve(proxyDetails.address, govFeeMKRExact.times(APPROVAL_FUDGE));
      //   setProxyDetails(proxyDetails => ({
      //     ...proxyDetails,
      //     hasMkrAllowance: true
      //   }));
      // } catch (err) {
      //   const message = err.message ? err.message : err;
      //   const errMsg = `unlock mkr tx failed ${message}`;
      //   console.error(errMsg);
      //   addToastWithTimeout(errMsg, dispatch);
      // }
      // setMkrApprovePending(false);
    };

    return (
      <Grid gridRowGap="m" justifyContent="center">
        <Text.h2 mt="m" textAlign="center">
          Burn your MKR in the ESM
        </Text.h2>
        <Card width={'28em'}>
          <CardBody mx="m">
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              mt="m"
              mb="s"
            >
              <Text.h5>Burn amount</Text.h5>
              <Text.h5>{`${burnAmount.toFixed(2)} MKR`}</Text.h5>
            </Flex>
          </CardBody>
          <CardBody mx="m">
            <Flex
              flexDirection="row"
              justifyContent="space-between"
              mt="s"
              mb="m"
            >
              <Text.h5>New ESM total</Text.h5>
              <Text.h5>{`${esmTotal.toFixed(2)} MKR`}</Text.h5>
            </Flex>
            <Grid flexDirection="column" gridRowGap="s" mb="m">
              <Text.h5 textAlign="left" mt="m" ml="m" fontWeight="500">
                Enter the following phrase to continue.
              </Text.h5>
              <Input
                mx={'m'}
                placeholder={`I am burning ${burnAmount.toFixed(2)} MKR`}
                disabled
                style={{ backgroundColor: '#F6F8F9' }}
              />
              <Input mx={'m'} placeholder={'I am..'} />
            </Grid>
          </CardBody>
        </Card>
        <Box pl="l">
          <LoadingToggle
            completeText={'MKR unlocked'}
            loadingText={'Unlocking MKR'}
            defaultText={'Unlock MKR to continue'}
            tokenDisplayName={'MKR'}
            isLoading={mkrApprovePending}
            isComplete={proxyDetails.hasMkrAllowance}
            onToggle={giveProxyMkrAllowance}
            disabled={proxyDetails.hasMkrAllowance || !proxyDetails.address}
            data-testid="allowance-toggle"
          />
          <TOSCheck mt={'m'} {...{ hasReadTOS, setHasReadTOS }} />
        </Box>
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
          <Button variant="danger" onClick={() => onContinue(3)} ml="s">
            Burn MKR
          </Button>
        </Flex>
      </Grid>
    );
  };

  const Step3 = ({ onClose, migrationTxHash, network }) => {
    return (
      <Fragment>
        <Text.h2 mt="m" textAlign="center">
          Your MKR is being burned
        </Text.h2>
        <Text
          style={{ fontSize: 17, color: '#48495F' }}
          mt="m"
          textAlign="center"
        >
          The estimated time is 8 minutes. You can close this modal
        </Text>
        <Link
          justifySelf="center"
          target="_blank"
          mt="m"
          // href={etherscanLink(migrationTxHash, network)}
        >
          <Button
            justifySelf="center"
            fontSize="s"
            py="xs"
            px="s"
            variant="secondary"
          >
            View transaction details <img src={arrowTopRight} />
          </Button>
        </Link>
        <LoadingBar />
        <Button
          variant="secondary-outline"
          color="black"
          onClick={onClose}
          width={'10em'}
          mt={'xl'}
        >
          Back
        </Button>
      </Fragment>
    );
  };

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

  const modalProps = {
    triggerText: 'Burn your MKR',
    ariaLabel: 'Modal to confirm burning your MKR for an emergency shutdown',
    ModalTrigger
  };
  const [mkrStaked, setMkrStaked] = useState(0);
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
              {`${mkrStaked.toFixed(0)} MKR `}

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
              {onClose => <ModalContent onClose={onClose} />}
            </ModalPortal>
            {mkrStaked === 0 ? (
              <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
                You have no MKR in the ESM
              </Text.p>
            ) : null}
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};
