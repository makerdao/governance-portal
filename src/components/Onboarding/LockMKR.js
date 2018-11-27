import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  Box,
  Grid,
  Text,
  Button,
  Flex,
  Link,
  Input,
  Card,
  Address
} from '@makerdao/ui-components';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import Header from './shared/Header';
import WalletIcon from './shared/WalletIcon';
import { lock } from '../../reducers/proxy';

const Label = styled(Box).attrs({
  fontSize: '1.4rem',
  fontWeight: 'medium',
  color: 'heading',
  mb: 's'
})``;

class LockMKR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
  }

  toNextStep = () => {
    this.setState({
      step: 1
    });
  };

  render() {
    return (
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridRowGap="m"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <Grid gridRowGap="l">
            <Header
              title="Deposit MKR"
              subtitle="In order to participate in voting, you must deposit MKR
      into your secure voting contract. The higher the amount, the more impact you’ll have on the system"
            />

            <Stepper step={this.state.step}>
              <Grid gridRowGap="l">
                <div>
                  <Label>Available MKR</Label>
                  <div>1,342.40 MKR available to vote</div>
                </div>

                <div>
                  <Label>MKR you would like to vote with?</Label>
                  <div>
                    <Input
                      maxWidth="334px"
                      placeholder="00.0000 MKR"
                      after={<Link fontWeight="medium">Set max</Link>}
                    />
                  </div>
                </div>

                <Flex justifyContent="center">
                  <Button onClick={this.toNextStep}>Confirm</Button>
                </Flex>
              </Grid>
              <div>
                <Label>MKR in your control</Label>
                <Card p="m" gridColumn="1/3">
                  <Grid
                    alignItems="center"
                    gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr auto']}
                    gridColumnGap="s"
                  >
                    <Box>
                      <WalletIcon
                        provider={'metamask'}
                        style={{ maxWidth: '27px', maxHeight: '27px' }}
                      />
                    </Box>
                    <Box>
                      <Link fontWeight="semibold">
                        <Address full={'0x12'} shorten />
                      </Link>
                    </Box>
                    <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
                      {0} MKR
                    </Box>
                    <Box
                      borderRadius="4px"
                      color="#E45432"
                      bg="#FFE2D9"
                      fontSize="1.2rem"
                      fontWeight="bold"
                      px="xs"
                    >
                      HOT WALLET
                    </Box>
                  </Grid>
                </Card>
                // TOOODOOOOO // add shared layout (with sidebar, and connect
                sidebar with redux store) // add styles here // connect amount
                of MKR to this component // add new component for 'wallet
                information' // add final step of confirm locking MKR // add
                faqs // add sidebar styles // add final page // think about
                cancel states // think about resuming onboarding after
                navigating away // remove old irrelevant code // improve mining
                animation // improve connecting between dai js lib state and
                reducer states //
              </div>
            </Stepper>
          </Grid>
          <Sidebar
            hotWallet={this.props.hotWallet}
            coldWallet={this.props.coldWallet}
          />
        </Grid>
      </Box>
    );
  }
}

export default connect(
  ({ onboarding, proxy }) => ({
    ...onboarding,
    ...proxy
  }),
  {
    lock
  }
)(LockMKR);
