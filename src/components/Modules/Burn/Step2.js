import React, { useState, useEffect } from 'react';
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
import { MKR } from '../../../chain/maker';
import LoadingToggle from '../../LoadingToggle';

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

export default ({ setStep, burnAmount, totalMkrInEsm, address, setTxHash }) => {
  const [localValue, setLocalValue] = useState('');
  const [error, setError] = useState('');
  const [hasReadTOS, setHasReadTOS] = useState(false);
  const [mkrApprovePending, setMkrApprovePending] = useState(false);
  const [proxyDetails, setProxyDetails] = useState({});
  const maker = window.maker;
  const esmAddress = maker.service('smartContract').getContractAddresses().ESM;

  const giveProxyMkrAllowance = async () => {
    setMkrApprovePending(true);
    try {
      await maker.getToken(MKR).approve(esmAddress, burnAmount);
      setProxyDetails(proxyDetails => ({
        ...proxyDetails,
        hasMkrAllowance: true
      }));
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `unlock mkr tx failed ${message}`;
      console.error(errMsg);
      // addToastWithTimeout(errMsg, dispatch);
    }
    setMkrApprovePending(false);
  };
  const verifyText = `I am burning ${burnAmount} MKR`;
  const onChange = event => {
    const { value } = event.target;
    setLocalValue(value);
    if (value !== verifyText) {
      setError('Please enter the exact phrase');
    } else {
      setError('');
    }
  };

  const burnMKR = async () => {
    try {
      const esm = await maker.service('esm');
      const burnTxObject = esm.stake(burnAmount);
      maker.service('transactionManager').listen(burnTxObject, {
        pending: tx => {
          setTxHash(tx.hash);
          setStep(3);
        },
        mined: tx => {
          setTxHash(tx.hash);
          setStep(4);
        },
        // confirmed: tx => {
        //   console.log('confirmed')
        //
        //   // do something when tx is confirmed
        // },
        error: () => setStep(5)
      });
    } catch (err) {
      const message = err.message ? err.message : err;
      const errMsg = `burn tx failed ${message}`;
      console.error(errMsg);
    }
  };
  useEffect(() => {
    (async () => {
      if (maker && address) {
        const connectedWalletAllowance = await maker
          .getToken(MKR)
          .allowance(address, esmAddress);
        const hasMkrAllowance = connectedWalletAllowance.gte(MKR(burnAmount));
        setProxyDetails({ hasMkrAllowance });
      }
    })();
  }, [address, maker, burnAmount, esmAddress]);

  return (
    <Grid gridRowGap="m" justifyContent="center" data-testid={'step2'}>
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
            <Text.h5>{`${burnAmount} MKR`}</Text.h5>
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
            <Text.h5>{totalMkrInEsm.plus(burnAmount).toString()}</Text.h5>
          </Flex>
          <Grid flexDirection="column" gridRowGap="s" mb="m">
            <Text.h5 textAlign="left" mt="m" ml="m" fontWeight="500">
              Enter the following phrase to continue.
            </Text.h5>
            <Input
              mx={'m'}
              placeholder={`I am burning ${burnAmount} MKR`}
              disabled
              style={{ backgroundColor: '#F6F8F9' }}
            />
            <Input
              mx={'m'}
              type="text"
              value={localValue}
              onChange={onChange}
              failureMessage={error}
              placeholder={'I am..'}
              data-testid={'confirm-input'}
            />
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
          disabled={proxyDetails.hasMkrAllowance}
          data-testid="allowance-toggle"
        />
        <TOSCheck mt={'m'} {...{ hasReadTOS, setHasReadTOS }} />
      </Box>
      <Flex flexDirection="row" justifyContent="center" m={'m'}>
        <Button
          variant="secondary-outline"
          color="black"
          onClick={() => {
            setStep(1);
          }}
          mr="s"
        >
          Back
        </Button>
        <Button
          variant="danger"
          disabled={
            localValue !== verifyText ||
            !hasReadTOS ||
            !proxyDetails.hasMkrAllowance
          }
          onClick={() => burnMKR()}
          data-testid="submit-burn"
          ml="s"
        >
          Burn MKR
        </Button>
      </Flex>
    </Grid>
  );
};
