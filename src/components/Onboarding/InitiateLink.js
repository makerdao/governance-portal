import React from 'react';
import { connect } from 'react-redux';
import { Box, Grid, Button, Flex } from '@makerdao/ui-components';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import ButtonCard from './shared/ButtonCard';
import Header from './shared/Header';
import TransactionStatusIndicator from './shared/TransactionStatusIndicator';

import { AccountTypes, TransactionStatus } from '../../utils/constants';
import {
  initiateLink,
  approveLink,
  mkrApproveProxy
} from '../../reducers/proxy';

const ChooseTransactionPriority = ({ onChoose }) => {
  return (
    <div>
      <Grid gridRowGap="m" alignContent="start">
        <Header
          title="Select transaction priority"
          subtitle={
            <React.Fragment>
              Note these are estimates of the time and cost per transaction.
              <br />
              There are 4 transactions in total.
            </React.Fragment>
          }
        />
        <ButtonCard
          title="Low"
          subtitle="$0.009 USD < 30 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
        <ButtonCard
          title="Medium"
          subtitle="$0.018 USD <5 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
        <ButtonCard
          title="High"
          subtitle="$0.120 USD • Estimate 2 minutes"
          buttonText="Select"
          onNext={onChoose}
        />
      </Grid>
    </div>
  );
};

const nicelyFormatWalletProvider = provider => {
  switch (provider) {
    case 'provider':
    case 'browser':
    case 'metamask':
    case AccountTypes.METAMASK:
      return 'MetaMask';
    case AccountTypes.TREZOR:
      return 'Trezor';
    case AccountTypes.LEDGER:
      return 'Ledger';
    default:
      return 'your wallet';
  }
};

const SignTransaction = ({
  walletProvider,
  title,
  subtitle,
  status,
  tx,
  onNext,
  onCancel
}) => {
  return (
    <Grid gridRowGap="l" justifyItems="center">
      <Header title={title} subtitle={subtitle} />
      <TransactionStatusIndicator
        provider={walletProvider}
        status={status}
        tx={tx}
      />
      <Flex justifyContent="center">
        <Button variant="secondary-outline" onClick={onCancel} mr="s">
          Cancel
        </Button>
        <Button
          disabled={
            status !== TransactionStatus.MINED &&
            status !== TransactionStatus.CONFIRMED
          }
          onClick={onNext}
        >
          Next
        </Button>
      </Flex>
    </Grid>
  );
};

class InitiateLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 3
    };
  }

  toChooseTransactionPriority = () => {
    this.setState({
      step: 0
    });
  };

  toInitiateLink = priority => {
    this.props.initiateLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 1
    });
  };

  toApproveLink = priority => {
    this.props.approveLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 2
    });
  };

  toGrantPermissions = () => {
    this.props.mkrApproveProxy();
    this.setState({
      step: 3
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
          <div>
            <Stepper step={this.state.step}>
              <ChooseTransactionPriority onChoose={this.toInitiateLink} />
              <SignTransaction
                title={`Sign ${nicelyFormatWalletProvider(
                  this.props.coldWallet.type
                )} transaction`}
                subtitle={`To proceed with setting up your voting contract,
      please sign the transaction in ${nicelyFormatWalletProvider(
        this.props.coldWallet.type
      )}.`}
                walletProvider={this.props.coldWallet.type}
                status={this.props.initiateLinkTxStatus}
                tx={this.props.initiateLinkTxHash}
                onNext={this.toApproveLink}
                onCancel={this.toChooseTransactionPriority}
              />
              <SignTransaction
                title={`Sign ${nicelyFormatWalletProvider(
                  this.props.hotWallet.type
                )} transaction`}
                subtitle={`To proceed with setting up your voting contract,
      please sign the transaction in ${nicelyFormatWalletProvider(
        this.props.hotWallet.type
      )}.`}
                walletProvider={this.props.hotWallet.type}
                status={this.props.approveLinkTxStatus}
                tx={this.props.approveLinkTxHash}
                onNext={this.toGrantPermissions}
                onCancel={this.toChooseTransactionPriority}
              />
              <SignTransaction
                title="Grant hot wallet permissions"
                subtitle="Give your voting contract permission so that your hot wallet can vote with your MKR"
                walletProvider={this.props.coldWallet.type}
                status={this.props.mkrApproveProxyTxStatus}
                tx={this.props.mkrApproveProxyTxHash}
                onNext={this.props.onComplete}
                onCancel={this.toChooseTransactionPriority}
              />
            </Stepper>
          </div>
          <Sidebar
            faqs={[]}
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
    initiateLink,
    approveLink,
    mkrApproveProxy
  }
)(InitiateLink);
