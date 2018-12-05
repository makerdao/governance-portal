import React from 'react';
import { connect } from 'react-redux';
import { Grid, Flex, Button } from '@makerdao/ui-components';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import ButtonCard from './shared/ButtonCard';
import Header from './shared/Header';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import SignTransactionStep from './shared/SignTransactionStep';
import faqs from './data/faqs';

import { AccountTypes } from '../../utils/constants';
import {
  breakLink,
  initiateLink,
  approveLink,
  mkrApproveProxy
} from '../../reducers/proxy';

import { getAccount } from '../../reducers/accounts';

const ChooseTransactionPriority = ({ onChoose, onCancel }) => {
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
        <Flex justifyContent="flex-start">
          <Button variant="secondary-outline" onClick={onCancel}>
            Change cold wallet
          </Button>
        </Flex>
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

class InitiateLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      faqs: []
    };
  }

  toChooseTransactionPriority = () => {
    this.setState({
      step: 0,
      faqs: []
    });
  };

  onTransactionPriorityChosen = () => {
    if (
      this.props.coldWallet.hasProxy &&
      this.props.coldWallet.proxy.hasInfMkrApproval
    ) {
      this.props.onComplete();
    } else if (
      this.props.coldWallet.hasProxy &&
      !this.props.coldWallet.proxy.hasInfMkrApproval
    ) {
      this.toGrantPermissions();
    } else {
      this.toInitiateLink();
    }
  };

  toInitiateLink = priority => {
    this.props.initiateLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 1,
      faqs: []
    });
  };

  toApproveLink = priority => {
    this.props.approveLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 2,
      faqs: faqs.approveLink
    });
  };

  toGrantPermissions = () => {
    const pollForProxyInformation = () => {
      if (this.props.coldWallet.proxy && this.props.coldWallet.proxy.address) {
        this.props.mkrApproveProxy();
      } else {
        setTimeout(pollForProxyInformation, 100);
      }
    };

    setTimeout(pollForProxyInformation, 100);

    this.setState({
      step: 3,
      faqs: faqs.grantHotWalletPermissions
    });
  };

  render() {
    return (
      <TwoColumnSidebarLayout
        sidebar={
          <Sidebar
            faqs={[]}
            hotWallet={this.props.hotWallet}
            coldWallet={this.props.coldWallet}
          />
        }
      >
        <div>
          <Stepper step={this.state.step}>
            <ChooseTransactionPriority
              onChoose={this.onTransactionPriorityChosen}
              onCancel={this.props.onCancel}
            />
            <SignTransactionStep
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
              onRetry={this.toInitiateLink}
              onCancel={this.toChooseTransactionPriority}
            />
            <SignTransactionStep
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
              onRetry={this.props.toApproveLink}
              onNext={this.toGrantPermissions}
            />
            <SignTransactionStep
              title="Grant hot wallet permissions"
              subtitle="Give your voting contract permission so that your hot wallet can vote with your MKR"
              walletProvider={this.props.coldWallet.type}
              status={this.props.mkrApproveProxyTxStatus}
              tx={this.props.mkrApproveProxyTxHash}
              onRetry={this.toGrantPermissions}
              onNext={this.props.onComplete}
            />
          </Stepper>
        </div>
      </TwoColumnSidebarLayout>
    );
  }
}

export default connect(
  ({ proxy, onboarding, ...state }) => ({
    hotWallet: getAccount(state, onboarding.hotWallet.address),
    coldWallet: getAccount(state, onboarding.coldWallet.address),
    ...proxy
  }),
  {
    breakLink,
    initiateLink,
    approveLink,
    mkrApproveProxy
  }
)(InitiateLink);
