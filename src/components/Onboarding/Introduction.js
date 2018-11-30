import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Grid,
  Flex,
  Card,
  Text,
  OnboardingMenu
} from '@makerdao/ui-components';

import metamask from '../../imgs/metamask.svg';
import time from '../../imgs/onboarding/time.svg';
import wallets from '../../imgs/onboarding/wallets.svg';
import eth from '../../imgs/onboarding/eth.svg';
import commandLine from '../../imgs/onboarding/command-line.svg';
import paperWallet from '../../imgs/onboarding/paper-wallet.svg';
import rightArrow from '../../imgs/onboarding/right-arrow.svg';

const H3 = styled.h3`
  font-size: 2rem;
`;

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

const Instructions = props => {
  return (
    <React.Fragment>
      <img src={props.imgSrc} alt="" />
      <Box pl="m" maxWidth="460px">
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
            maxWidth: '34px',
            maxHeight: '34px'
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

const Introduction = ({ show, onClose, onLinkedWallet }) => {
  return (
    <Container show={show}>
      <Grid
        width="100vw"
        height="100vh"
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
              <h1 style={{ fontWeight: 'normal', fontSize: '4rem' }}>
                Set up your voting contract
              </h1>
            </Box>

            <Grid
              gridRowGap="l"
              gridColumnGap="s"
              gridTemplateColumns="54px 1fr"
            >
              <Instructions
                imgSrc={time}
                title="It will take about 5 minutes"
                subtitle="The total time to complete the contract set up is 5 minutes depending on transaction confirmation times."
              />
              <Instructions
                imgSrc={wallets}
                title="You will need access to your wallets"
                subtitle="You will need access both your hot and cold wallets to confirm the transactions."
              />
              <Instructions
                imgSrc={eth}
                title="You will need to pay ETH gas costs"
                subtitle="You will need to confirm 4 transactions which costs an estimated total of $3.30 USD."
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
          bg="#F6F8F9"
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
              imgSrc={metamask}
              title="Vote with a linked wallet"
              subtitle="We support Metamask, Ledger and Trezor."
            />
            <WalletCard
              onClick={onLinkedWallet}
              imgSrc={paperWallet}
              title="Vote with a paper wallet"
              subtitle="Voting using your paper wallet."
            />
            <WalletCard
              onClick={onLinkedWallet}
              imgSrc={commandLine}
              title="Vote using command line"
              subtitle="Vote directly with command line."
            />
          </Grid>
        </Flex>
      </Grid>
    </Container>
  );
};

export default Introduction;
