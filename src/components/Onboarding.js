import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import {
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep
} from '../reducers/onboarding';
import Terms from './onboarding/Terms';

import {
  OnboardingFullScreen,
  Box,
  Text,
  Grid,
  Card,
  Button,
  Flex,
  Table,
  Overflow
} from '@makerdao/ui-components';
import metamaskImg from '../imgs/metamask.svg';
import trezorImg from '../imgs/trezor.png';
import ledgerImg from '../imgs/ledger.svg';

const Sidebar = () => {
  return (
    <Card p="m" gridColumn={['1', '1', '2']} gridRow="span -1">
      <Grid gridRowGap="s">
        <div>
          <Text fontWeight="bold">Ethereum Mainnet</Text>
          <Table width="100%" variant="cozy">
            <tbody>
              <tr>
                <td>Contract 1</td>
                <td>0x...a0D9ef</td>
              </tr>
              <tr>
                <td>Contract 2</td>
                <td>0x...a0D9ef</td>
              </tr>
              <tr>
                <td>Contract 3</td>
                <td>0x...a0D9ef</td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div>
          <Text fontWeight="bold">Supporting FAQ</Text>
          <p>
            Lorem ipsum dolor sit amet, consect adipiscing elit. Nam nec
            consectet sapien. Proin eget loren ipsum.
          </p>
        </div>

        <div>
          <Text fontWeight="bold">Supporting FAQ</Text>
          <p>
            Lorem ipsum dolor sit amet, consect adipiscing elit. Nam nec
            consectet sapien. Proin eget loren ipsum.
          </p>
        </div>
      </Grid>
    </Card>
  );
};

const Onboarding = ({
  open,
  step,
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep
}) => {
  return (
    <OnboardingFullScreen
      step={step}
      show={open}
      onClose={onboardingClose}
      steps={[
        'Terms',
        'Choose Hot',
        'Choose Cold',
        'Sign Hot TX',
        'Store MKR',
        'Sign Cold TX'
      ]}
    >
      <Terms
        onboardingClose={onboardingClose}
        onboardingNextStep={onboardingNextStep}
      />

      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridRowGap="s"
          gridColumnGap="xl"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <Grid gridRowGap="s" alignContent="start">
            <Text textAlign="center" gridColumn="1">
              <h2>Connect a hot wallet</h2>
            </Text>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={metamaskImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Metamask</h3>
                  <p>Open and unlock wallet</p>
                </Box>
                <Button onClick={onboardingNextStep}>Connect</Button>
              </Flex>
            </Card>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={trezorImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Trezor</h3>
                  <p>Connect via USB and unlock</p>
                </Box>
                <Button onClick={onboardingNextStep}>Connect</Button>
              </Flex>
            </Card>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={ledgerImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Ledger</h3>
                  <p>Open and unlock wallet</p>
                </Box>
                <Button onClick={onboardingNextStep}>Connect</Button>
              </Flex>
            </Card>
          </Grid>
          <Sidebar />
        </Grid>
      </Box>

      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridRowGap="s"
          gridColumnGap="xl"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <Grid gridRowGap="s" alignContent="start">
            <Text textAlign="center" gridColumn="1">
              <h2>Connect a cold wallet</h2>
            </Text>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={metamaskImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Metamask</h3>
                  <p>Open and unlock wallet</p>
                </Box>
                <Button>Connect</Button>
              </Flex>
            </Card>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={trezorImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Trezor</h3>
                  <p>Connect via USB and unlock</p>
                </Box>
                <Button>Connect</Button>
              </Flex>
            </Card>
            <Card p="s" gridColumn="1">
              <Flex alignItems="center">
                <Box pl="s" pr="m">
                  <img width="20px" src={ledgerImg} />
                </Box>
                <Box flexGrow="1" pr="s">
                  <h3>Ledger</h3>
                  <p>Open and unlock wallet</p>
                </Box>
                <Button>Connect</Button>
              </Flex>
            </Card>
          </Grid>
          <Sidebar />
        </Grid>
      </Box>
    </OnboardingFullScreen>
  );
};

export default connect(
  state => state.onboarding,
  {
    onboardingClose,
    onboardingNextStep,
    onboardingPrevStep
  }
)(Onboarding);
