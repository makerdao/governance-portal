import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { mkrApproveProxy, goToStep, smartStepSkip } from '../../reducers/proxy';
import { getActiveAccount, getAccount } from '../../reducers/accounts';
import Transaction from './shared/Transaction';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  FlexRowEnd,
  Skip
} from './shared/styles';
import Button from '../Button';
import { setInfMkrApproval } from '../../reducers/accounts';

class MKRApprove extends Component {
  render() {
    const {
      mkrApproveInitiated: initiated,
      confirmingMkrApproveProxy: confirming,
      network,
      activeAccount,
      linkedAccount,
      mkrApproveProxyTxHash: txHash
    } = this.props;
    if (initiated) {
      const coldAccount =
        activeAccount.proxyRole === 'hot' ? linkedAccount : activeAccount;
      return (
        <Transaction
          txPurpose="This transaction is to give your personal voting contract some approvals"
          confirming={confirming}
          network={network}
          txHash={txHash}
          account={coldAccount}
          nextStep={() => this.props.setInfMkrApproval()}
        />
      );
    } else {
      return (
        <Fragment>
          <StyledTop>
            <StyledTitle>Voting Contract MKR Allowances</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
            <div style={{ margin: 'auto', marginTop: '10px', width: '90%' }}>
              Before you deposit MKR into your voting contract for the first
              time, you must give it allowances from your cold wallet. By
              clicking "grant", you will grant the voting contract permission to
              move your MKR into the voting contracts, a capability you can
              revoke at any time.
            </div>
          </StyledBlurb>
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              justifyContent: 'center'
            }}
          >
            <FlexRowEnd style={{ width: '100%' }}>
              <Skip mr={24} onClick={() => this.props.smartStepSkip()}>
                Skip this step
              </Skip>
              <Button slim onClick={() => this.props.mkrApproveProxy()}>
                Grant
              </Button>
            </FlexRowEnd>
          </div>
        </Fragment>
      );
    }
  }
}

export default connect(
  ({ proxy, metamask, accounts }) => ({
    activeAccount: getActiveAccount({ accounts }),
    linkedAccount: getAccount(
      { accounts },
      getActiveAccount({ accounts }).proxy.linkedAccount.address
    ),
    network: metamask.network,
    mkrApproveProxyTxHash: proxy.mkrApproveProxyTxHash,
    confirmingMkrApproveProxy: proxy.confirmingMkrApproveProxy,
    mkrApproveInitiated: proxy.mkrApproveInitiated
  }),
  { mkrApproveProxy, goToStep, smartStepSkip, setInfMkrApproval }
)(MKRApprove);
