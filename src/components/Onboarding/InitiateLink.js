import React from 'react';
import { connect } from 'react-redux';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import SignTransactionStep from './shared/SignTransactionStep';
import faqs from './data/faqs';
import { nicelyFormatWalletProvider } from './utils';

import {
  breakLink,
  initiateLink,
  approveLink,
  mkrApproveProxy
} from '../../reducers/proxy';

import { getAccount } from '../../reducers/accounts';

class InitiateLink extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      faqs: []
    };
  }

  componentDidMount() {
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
  }

  toInitiateLink = priority => {
    this.props.initiateLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 0,
      faqs: []
    });
  };

  toApproveLink = priority => {
    this.props.approveLink({
      hot: this.props.hotWallet,
      cold: this.props.coldWallet
    });
    this.setState({
      step: 1,
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
      step: 2,
      faqs: faqs.grantHotWalletPermissions
    });
  };

  render() {
    const {
      hotWallet,
      coldWallet,
      initiateLinkTxHash,
      initiateLinkTxStatus,
      approveLinkTxHash,
      approveLinkTxStatus,
      mkrApproveProxyTxHash,
      mkrApproveProxyTxStatus,
      onComplete
    } = this.props;
    return (
      <TwoColumnSidebarLayout
        sidebar={
          <Sidebar faqs={[]} hotWallet={hotWallet} coldWallet={coldWallet} />
        }
      >
        <div>
          <Stepper step={this.state.step}>
            <SignTransactionStep
              title={`Sign ${nicelyFormatWalletProvider(
                coldWallet.type
              )} transaction`}
              subtitle={`To proceed with setting up your voting contract,
      please sign the transaction in ${nicelyFormatWalletProvider(
        coldWallet.type
      )}.`}
              walletProvider={coldWallet.type}
              status={initiateLinkTxStatus}
              tx={initiateLinkTxHash}
              onNext={this.toApproveLink}
              onRetry={this.toInitiateLink}
              onCancel={this.toChooseTransactionPriority}
            />
            <SignTransactionStep
              title={`Sign ${nicelyFormatWalletProvider(
                hotWallet.type
              )} transaction`}
              subtitle={`To proceed with setting up your voting contract,
      please sign the transaction in ${nicelyFormatWalletProvider(
        hotWallet.type
      )}.`}
              walletProvider={hotWallet.type}
              status={approveLinkTxStatus}
              tx={approveLinkTxHash}
              onRetry={this.toApproveLink}
              onNext={this.toGrantPermissions}
            />
            <SignTransactionStep
              title="Grant hot wallet permissions"
              subtitle="Give your voting contract permission so that your hot wallet can vote with your MKR"
              walletProvider={coldWallet.type}
              status={mkrApproveProxyTxStatus}
              tx={mkrApproveProxyTxHash}
              onRetry={this.toGrantPermissions}
              onNext={onComplete}
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
