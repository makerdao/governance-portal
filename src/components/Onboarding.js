import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import {
  onboardingClose,
  onboardingNextStep,
  onboardingPrevStep
} from '../reducers/onboarding';

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
      <Box maxWidth="540px" m="0 auto">
        <Grid gridRowGap="s">
          <Text textAlign="center">Terms of Use</Text>
          <Card p="m">
            <Overflow height="270px" pr="m">
              <Text typography="p4">
                Please read these Terms of Use (the “Terms” or “Terms of Use”)
                carefully before using the Service. By using or otherwise
                accessing the Service, or clicking to accept or agree to these
                Terms where that option is made available, you (1) agree that
                you have read and understand these Terms (2) accept and agree to
                these Terms and (3) any additional terms, rules and conditions
                of participation issued from time-to-time. If you do not agree
                to the Terms, then you may not access or use the Content or
                Service. MKR is a cryptographic governance token used in the Dai
                System and Software, which is an autonomous system of smart
                contract Please read these Terms of Use (the “Terms” or “Terms
                of Use”) carefully before using the Service. By using or
                otherwise accessing the Service, or clicking to accept or agree
                to these Terms where that option is made available, you (1)
                agree that you have read and understand these Terms (2) accept
                and agree to these Terms and (3) any additional terms, rules and
                conditions of participation issued from time-to-time. If you do
                not agree to the Terms, then you may not access or use the
                Content or Service. MKR is a cryptographic governance token used
                in the Dai System and Software, which is an autonomous system of
                smart contract Please read these Terms of Use (the “Terms” or
                “Terms of Use”) carefully before using the Service. By using or
                otherwise accessing the Service, or clicking to accept or agree
                to these Terms where that option is made available, you (1)
                agree that you have read and understand these Terms (2) accept
                and agree to these Terms and (3) any additional terms, rules and
                conditions of participation issued from time-to-time. If you do
                not agree to the Terms, then you may not access or use the
                Content or Service. MKR is a cryptographic governance token used
                in the Dai System and Software, which is an autonomous system of
                smart contract
              </Text>
            </Overflow>
          </Card>
          <Flex justifyContent="center">
            <Button variant="secondary" onClick={onboardingClose} mr="s">
              Cancel
            </Button>
            <Button onClick={onboardingNextStep}>I agree</Button>
          </Flex>
        </Grid>
      </Box>
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridRowGap="s"
          gridColumnGap="xl"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <Grid gridRowGap="s" alignContent="start">
            <Text as="h2" textAlign="center" gridColumn="1">
              Connect a hot wallet
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
          <Card
            p="m"
            gridColumn={['1', '1', '2']}
            gridRow="span -1"
            height="100%"
          >
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
