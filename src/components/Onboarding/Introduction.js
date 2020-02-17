import React from 'react';
import styled from 'styled-components';
import { Box, Grid, Flex, Card, Text } from '@makerdao/ui-components-core';
import { OnboardingMenu } from '@makerdao/ui-components-onboarding';

import { H1, H3 } from '../../utils/typography';

import metamask from '../../imgs/metamask.svg';
import time from '../../imgs/onboarding/time.svg';
import eth from '../../imgs/onboarding/eth.svg';
import ledger from '../../imgs/onboarding/ledger-logomark.svg';
import trezor from '../../imgs/onboarding/trezor-logomark.svg';
import linkedWallet from '../../imgs/onboarding/linked-wallet.svg';
import singleWallet from '../../imgs/onboarding/single-wallet.svg';
import rightArrow from '../../imgs/onboarding/right-arrow.svg';

const Container = styled(Box)`
  transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
  transform: translateX(-10px);
  opacity: 0;

  ${props =>
    props.show &&
    `
    transform: translateX(0px);
    opacity: 1;
  `};
`;

const Icons = {
  browser: metamask,
  ledger,
  trezor
};

const walletIconWidth = '3.4rem';
const instructionImageWidth = '5.4rem';
const instructionWidth = '46rem';

const Instructions = props => {
  return (
    <React.Fragment>
      <Box pl="m" maxWidth={instructionWidth}>
        <Box mb="0.6rem">
          <H3>{props.title}</H3>
        </Box>
        <p>
          <Text t="p2">{props.subtitle}</Text>
        </p>
      </Box>
    </React.Fragment>
  );
};

const WalletCard = props => {
  return (
    <Card py="m" px="l" style={{ cursor: 'pointer' }} {...props}>
      <Grid
        gridTemplateColumns="auto 1fr auto"
        alignItems="center"
        gridColumnGap="l"
      >
        <img
          src={props.imgSrc}
          alt=""
          style={{
            maxWidth: walletIconWidth,
            maxHeight: walletIconWidth
          }}
        />
        <Box>
          <Box mb="0.4rem">
            <H3>{props.title}</H3>
          </Box>
          <p>{props.subtitle}</p>
        </Box>
        <img src={rightArrow} alt="" />
      </Grid>
    </Card>
  );
};

const Introduction = ({
  show,
  onClose,
  onLinkedWallet,
  onSingleWallet,
  activeAccountType
}) => {
  const walletIcon = Icons[activeAccountType] || singleWallet;

  return (
    <Container show={show} height="100%" position="fixed">
      <Grid
        width="100vw"
        height="100%"
        gridTemplateColumns={['1fr', '1fr', '1fr', '1fr 1fr']}
        style={{ overflow: 'scroll' }}
      >
        <Flex
          p="m"
          bg="white"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gridRow={['2', '2', '2', '1 / 3']}
        >
          <Box mb="l">
            <Box mb="xl">
              <H1>Set up your voting contract</H1>
            </Box>

            <Grid
              gridRowGap="l"
              gridColumnGap="s"
              gridTemplateColumns={`${instructionImageWidth} 1fr`}
            >
              <img src={time} alt="" />
              <Instructions
                title="It will take about 5 minutes"
                subtitle="The total time to complete the contract set up is 5 minutes depending on transaction confirmation times."
              />

              <img src={eth} alt="" />
              <Instructions
                title="You will need to pay ETH gas costs"
                subtitle="You will need to submit up to 4 transactions."
              />
            </Grid>
          </Box>
        </Flex>
        <Box
          bg={['white', 'white', 'white', 'transparent']}
          p="l"
          gridRow="1"
          gridColumn={['1', '1', '1', '2']}
          zIndex="2"
        >
          <OnboardingMenu onClose={onClose} />
        </Box>
        <Flex
          p="m"
          bg="backgroundGrey"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gridRow={['3', '3', '3', '1 / 3']}
          gridColumn={['1', '1', '1', '2']}
          zIndex="1"
        >
          <Grid gridRowGap="m" gridTemplateColumns="1fr">
            <WalletCard
              onClick={onLinkedWallet}
              imgSrc={linkedWallet}
              title="Vote with a linked wallet"
              subtitle="We support Metamask, Ledger and Trezor."
            />
            <WalletCard
              onClick={onSingleWallet}
              imgSrc={walletIcon}
              title="Vote with a single wallet"
              subtitle="Vote with the account selected in the accounts dropdown."
            />
          </Grid>
        </Flex>
      </Grid>
    </Container>
  );
};

export default Introduction;
