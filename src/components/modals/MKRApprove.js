import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { mkrApproveProxy } from '../../reducers/proxy';
import { getActiveAccount } from '../../reducers/accounts';
import TransactionModal from './shared/InitiateTransaction';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  FlexRowEnd
} from './shared/styles';
import Button from '../Button';
import { modalClose } from '../../reducers/modal';

class MKRApprove extends Component {
  render() {
    const { activeAccount, txHash, txStatus, mkrApproveProxy } = this.props;

    return (
      <TransactionModal
        txStatus={txStatus}
        txHash={txHash}
        txPurpose="This transaction is to give your personal voting contract some approvals"
        account={activeAccount}
        onComplete={modalClose}
      >
        {onNext => {
          return (
            <Fragment>
              <StyledTop>
                <StyledTitle>Voting Contract MKR Allowances</StyledTitle>
              </StyledTop>
              <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
                <div
                  style={{ margin: 'auto', marginTop: '10px', width: '90%' }}
                >
                  Before you deposit MKR into your voting contract for the first
                  time, you must give it allowances from your cold wallet. By
                  clicking "grant", you will grant the voting contract
                  permission to move your MKR into the voting contracts, a
                  capability you can revoke at any time.
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
                  <Button
                    slim
                    onClick={() => {
                      mkrApproveProxy();
                      onNext();
                    }}
                  >
                    Grant
                  </Button>
                </FlexRowEnd>
              </div>
            </Fragment>
          );
        }}
      </TransactionModal>
    );
  }
}

export default connect(
  ({ proxy, metamask, accounts }) => ({
    activeAccount: getActiveAccount({ accounts }),
    txHash: proxy.mkrApproveProxyTxHash,
    txStatus: proxy.mkrApproveProxyTxStatus
  }),
  { mkrApproveProxy }
)(MKRApprove);
