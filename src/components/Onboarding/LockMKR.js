import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import {
  Box,
  Grid,
  Button,
  Flex,
  Link,
  Input,
  Card,
  Address
} from '@makerdao/ui-components';

import linkImg from '../../imgs/onboarding/link-lock.svg';
import lockImg from '../../imgs/onboarding/lock.svg';

import faqs from './data/faqs';
import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import Header from './shared/Header';
import WalletIcon from './shared/WalletIcon';
import SignTransactionStep from './shared/SignTransactionStep';
import { lock } from '../../reducers/proxy';
import { ColdWalletTag, VotingContractTag } from './shared/Tags';

const Label = styled(Box).attrs({
  fontSize: '1.4rem',
  fontWeight: 'medium',
  color: 'heading'
})``;

class LockMKR extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      votingMKR: '',
      error: false,
      faqs: []
    };
  }

  toChooseDepositAmount = () => {
    this.setState({
      step: 0,
      faqs: []
    });
  };

  toConfirmDepositAmount = () => {
    this.setState({
      step: 1,
      faqs: faqs.confirmLockMKR
    });
  };

  toLockMKR = () => {
    this.props.lock(parseFloat(this.state.votingMKR));
    this.setState({
      step: 2,
      faqs: faqs.lockMKR
    });
  };

  handleVotingMKRChange = event => {
    this.setState({
      votingMKR: event.target.value
    });
  };

  validate = event => {
    const mkr = parseFloat(event.target.value);
    if (Number.isNaN(mkr)) {
      this.setState({
        error: 'Please enter a valid number'
      });
    } else if (mkr === 0) {
      this.setState({
        error: 'Please enter a number greater than zero'
      });
    } else if (mkr > this.props.coldWallet.mkrBalance) {
      this.setState({
        error: `The maximum amount of MKR you can lock is ${
          this.props.coldWallet.mkrBalance
        }`
      });
    } else {
      this.setState({
        error: false
      });
    }
  };

  setMaxVotingMKR = () => {
    this.setState({
      votingMKR: this.props.coldWallet.mkrBalance,
      error: false
    });
  };

  render() {
    return (
      <Box maxWidth="960px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridRowGap="m"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <Grid gridRowGap="l">
            {this.state.step <= 1 && (
              <Header
                title="Deposit MKR"
                subtitle="In order to participate in voting, you must deposit MKR
      into your secure voting contract. The higher the amount, the more impact you’ll have on the system"
              />
            )}

            <Stepper step={this.state.step}>
              <Grid gridRowGap="l">
                <div>
                  <Label mb="s">Available MKR</Label>
                  <div>
                    {this.props.coldWallet.mkrBalance} MKR available to vote
                  </div>
                </div>

                <div>
                  <Label mb="s">MKR you would like to vote with?</Label>
                  <div>
                    <Input
                      maxWidth="334px"
                      placeholder="00.0000 MKR"
                      value={this.state.votingMKR}
                      onChange={this.handleVotingMKRChange}
                      onBlur={this.validate}
                      after={
                        <Link
                          fontWeight="medium"
                          onClick={this.setMaxVotingMKR}
                        >
                          Set max
                        </Link>
                      }
                      errorMessage={this.state.error}
                    />
                  </div>
                </div>

                <Flex justifyContent="center">
                  <Button
                    disabled={this.state.error}
                    onClick={this.toConfirmDepositAmount}
                  >
                    Confirm
                  </Button>
                </Flex>
              </Grid>
              <div>
                <Label mb="xs">MKR in your control</Label>
                <Card px="m" py="s">
                  <Grid
                    alignItems="center"
                    gridTemplateColumns="auto 1fr 1fr 1fr"
                    gridColumnGap="s"
                  >
                    <Box>
                      <WalletIcon
                        provider={this.props.coldWallet.type}
                        style={{ maxWidth: '27px', maxHeight: '27px' }}
                      />
                    </Box>
                    <Box>
                      <Link fontWeight="semibold">
                        <Address full={this.props.coldWallet.address} shorten />
                      </Link>
                    </Box>
                    <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
                      {this.props.coldWallet.mkrBalance} MKR
                    </Box>
                    <Flex justifyContent="flex-end">
                      <ColdWalletTag />
                    </Flex>
                  </Grid>
                </Card>

                <Box ml="s" mt="xs">
                  <img src={linkImg} alt="" />
                </Box>

                <Label mb="xs">Secure MKR ready to vote</Label>
                <Card px="m" py="s">
                  <Grid
                    alignItems="center"
                    gridTemplateColumns="auto 1fr 1fr 1fr"
                    gridColumnGap="s"
                  >
                    <Box>
                      <img src={lockImg} alt="" />
                    </Box>
                    <Box>
                      <Link fontWeight="semibold">Address hidden</Link>
                    </Box>
                    <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
                      {this.state.votingMKR} MKR
                    </Box>
                    <Flex justifyContent="flex-end">
                      <VotingContractTag />
                    </Flex>
                  </Grid>
                </Card>

                <Flex justifyContent="flex-end" mt="m">
                  <Button
                    variant="secondary-outline"
                    mr="s"
                    onClick={this.toChooseDepositAmount}
                  >
                    Back
                  </Button>

                  <Button onClick={this.toLockMKR}>Confirm</Button>
                </Flex>
              </div>
              <SignTransactionStep
                title="Confirm lock MKR"
                subtitle={
                  <span>
                    In order to start voting please confirm the Locking of MKR
                    on your cold wallet ending in{' '}
                    <Link>{this.props.coldWallet.address.slice(-4)}</Link>.
                    <br />
                    You can withdraw your MKR at anytime.
                  </span>
                }
                walletProvider={this.props.coldWallet.type}
                status={this.props.sendMkrTxStatus}
                tx={this.props.sendMkrTxHash}
                onNext={this.props.onComplete}
                onCancel={this.toConfirmDepositAmount}
              />
            </Stepper>
          </Grid>
          <Sidebar
            hotWallet={this.props.hotWallet}
            coldWallet={this.props.coldWallet}
            faqs={this.state.faqs}
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
