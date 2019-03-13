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
  mkrApproveProxy,
  mkrApproveSingleWallet
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
    console.log('SINGLE WALLET', this.props);
    this.toGrantPermissions();
  }

  toGrantPermissions = () => {
    console.log('props in single wallet', this.props);
    this.props.mkrApproveSingleWallet();

    this.setState({
      faqs: faqs.grantHotWalletPermissions
    });
  };

  render() {
    console.log('3-SingleWallet state', this.state, this.props);
    const {
      hotWallet,
      coldWallet,
      singleWallet,
      mkrApproveProxyTxHash,
      mkrApproveProxyTxStatus,
      onComplete
    } = this.props;
    return (
      <TwoColumnSidebarLayout
        sidebar={
          <Sidebar
            faqs={this.state.faqs}
            singleWallet={singleWallet}
            hotWallet={hotWallet}
            coldWallet={coldWallet}
          />
        }
      >
        <div>
          <Stepper step={this.state.step}>
            <SignTransactionStep
              title="Grant your wallet permissions"
              subtitle="Give the voting contract permission so that your wallet can vote with your MKR"
              walletProvider={singleWallet.type}
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
    hotWallet: '',
    coldWallet: '',
    singleWallet: getAccount(state, state.accounts.activeAccount),
    skipProxy: onboarding.skipProxy,
    ...proxy
  }),
  {
    breakLink,
    initiateLink,
    approveLink,
    mkrApproveProxy,
    mkrApproveSingleWallet
  }
)(InitiateLink);
