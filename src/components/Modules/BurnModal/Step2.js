import React, { useState } from 'react';
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

export default ({ onContinue }) => {
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
