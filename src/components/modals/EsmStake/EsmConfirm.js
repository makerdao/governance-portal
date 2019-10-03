import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Grid,
  Link,
  Button,
  Checkbox,
  Card
} from '@makerdao/ui-components-core';
import ScreenHeader from '../../ScreenHeader';
import ScreenFooter from '../../ScreenFooter';
import { netIdToName, ethScanLink } from '../../../utils/ethereum';

const EsmStakeSummary = ({ onClose, stakeAmount, onClick }) => {
  const [hasReadTOS, setHasReadTOS] = useState(false);

  const rows = [
    ['Stake Amount', `${stakeAmount} DAI`],
    ['New ESM Total', `${stakeAmount} DAI`]
  ];
  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <Text.h2 textAlign="center" mb="xl">
        Confirm Stake in ESM
      </Text.h2>
      <Card py={{ s: 'm', m: 'l' }} px={{ s: 'm', m: 'xl' }} my="l">
        <Grid>
          {rows.map(([title, value], index) => {
            return (
              <Grid
                key={title + value}
                mt={!!index && 's'}
                pt={!!index && 's'}
                gridTemplateColumns="5fr 1fr"
                justifyItems="start"
                borderTop={index !== 0 ? '1px solid' : null}
                color="grey.200"
              >
                <Text>{title}</Text>
                <Text
                  fontWeight="bold"
                  css="white-space: nowrap"
                  textAlign={{ s: 'right', m: 'left' }}
                >
                  {value}
                </Text>
              </Grid>
            );
          })}
        </Grid>
        <Grid
          justifyContent="center"
          mt="l"
          alignItems="center"
          gridColumnGap="xs"
          gridTemplateColumns="auto auto"
        >
          <Checkbox
            checked={hasReadTOS}
            onChange={() => setHasReadTOS(state => !state)}
          />
          <Text color="grey.500">
            I have read and accepted the
            <Link>Terms of Service</Link>
          </Text>
        </Grid>
      </Card>
      <ScreenFooter
        canProgress={hasReadTOS}
        onNext={() => onClick(true)}
        onBack={onClose}
      />
    </Box>
  );
};

const EsmStakeWait = ({ onClose }) => {
  // TODO remove mocked vars and add from state
  const hash =
    '0x7dfb04027513e52a0062beb312a108f28055faab01c3efca605511652a80ddbc';
  const networkId = '42';

  return (
    <Box
      maxWidth="1040px"
      css={`
        margin: 0 auto;
      `}
    >
      <Text.h2 textAlign="center" mb="xl">
        Your MKR is being staked in the ESM
      </Text.h2>
      <Text.p textAlign="center" mb="xl">
        The estimated time is 8 minutes. You can safely leave this page.
      </Text.p>
      <Flex my="l" justifyContent="center">
        <Grid gridRowGap="s">
          <Box my="l" textAlign="center">
            <Link
              target="_blank"
              href={ethScanLink(hash, netIdToName(networkId))}
            >
              View transaction details
            </Link>
            <Box m="auto">About 5 minutes remaining</Box>
          </Box>
          <Flex textAlign="center" justifyContent="center">
            <Button onClick={onClose} width="145px">
              Exit
            </Button>
          </Flex>
        </Grid>
      </Flex>
    </Box>
  );
};

const EsmConfirm = ({ dispatch, onClose }) => {
  const [txInProgress, setTtxInProgress] = useState(false);

  if (txInProgress) return <EsmStakeWait onClose={onClose} />;

  return <EsmStakeSummary onClick={setTtxInProgress} onClose={onClose} />;
};

export default EsmConfirm;
