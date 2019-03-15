import React from 'react';
import { connect } from 'react-redux';

import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import SignTransactionStep from './shared/SignTransactionStep';
import faqs from './data/faqs';

import {
  breakLink,
  initiateLink,
  approveLink,
  mkrApproveProxy,
  mkrApproveSingleWallet,
  iouApproveSingleWallet
} from '../../reducers/proxy';

import { getAccount } from '../../reducers/accounts';

class SingleWalletApprovals extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      faqs: faqs.grantHotWalletPermissions
    };
  }

  componentDidMount() {
    const { hasInfIouApproval, hasInfMkrApproval } = this.props.singleWallet;

    if (hasInfIouApproval && hasInfMkrApproval) this.props.onComplete();
    else if (hasInfMkrApproval && !hasInfIouApproval)
      this.toGrantIouPermissions();
    else this.toGrantMkrPermissions();
  }

  toGrantMkrPermissions = () => {
    this.props.mkrApproveSingleWallet();
  };

  toGrantIouPermissions = () => {
    this.props.iouApproveSingleWallet();

    this.setState({
      step: 1
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
      iouApproveProxyTxStatus,
      iouApproveProxyTxHash,
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
              title="Grant permissions"
              subtitle="Give the governance contract transfer allowances for your MKR tokens"
              walletProvider={singleWallet.type}
              status={mkrApproveProxyTxStatus}
              tx={mkrApproveProxyTxHash}
              onRetry={this.toGrantMkrPermissions}
              onNext={this.toGrantIouPermissions}
            />
            <SignTransactionStep
              title="Grant permissions"
              subtitle="Give the governance contract transfer allowances for your IOU tokens"
              walletProvider={singleWallet.type}
              status={iouApproveProxyTxStatus}
              tx={iouApproveProxyTxHash}
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
    mkrApproveSingleWallet,
    iouApproveSingleWallet
  }
)(SingleWalletApprovals);
