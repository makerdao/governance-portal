import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  StyledInput
} from '../shared/styles';
import Button from '../../Button';
import Intro from './Intro';
import Link from './Link';
import Transaction from '../shared/Transaction';
import ProgressTabs from './ProgressTabs';
import { getActiveAccount } from '../../../reducers/accounts';
import { trezorConnectInit } from '../../../reducers/trezor';
import {
  initiateLink,
  sendMkrToProxy,
  approveLink,
  clear as proxyClear
} from '../../../reducers/proxy';
import { sendVote } from '../../../reducers/vote';
import { modalClose } from '../../../reducers/modal';

class ProxySetup extends Component {
  state = {
    step: 1,
    mkrAmountInput: ''
  };

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  updateInputValue = evt => {
    this.setState({ mkrAmountInput: evt.target.value });
  };

  componentDidUpdate(prevProps) {
    // they've signed and sent a tx
    if (this.props.initiateLinkTxHash !== prevProps.initiateLinkTxHash)
      this.nextStep();
    if (this.props.approveLinkTxHash !== prevProps.approveLinkTxHash)
      this.nextStep();
    if (this.props.sendMkrTxHash !== prevProps.sendMkrTxHash) this.nextStep();
  }

  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, check balances, etc
  render() {
    switch (this.state.step) {
      case 1:
        return (
          <Intro modalClose={this.props.modalClose} nextStep={this.nextStep} />
        );
      case 2:
        window.scrollTo(0, 0);
        return (
          <Link
            initiateLink={this.props.initiateLink}
            activeAccount={this.props.activeAccount}
            // trezorConnectInit={this.props.trezorConnectInit}
            accounts={this.props.accounts}
          />
        );
      case 3:
        return (
          <Fragment>
            <ProgressTabs progress={1} />
            <Transaction
              txHash={this.props.initiateLinkTxHash}
              nextStep={this.nextStep}
              network={this.props.network}
            />
          </Fragment>
        );
      case 4:
        return (
          <Fragment>
            <StyledTop>
              <StyledTitle>
                Please confirm link with your hot wallet
              </StyledTitle>
            </StyledTop>
            <StyledBlurb>
              Your hot wallet address: {this.props.hotAddress}
            </StyledBlurb>
            {this.props.activeAccount.address.toLowerCase() !==
            this.props.hotAddress.toLowerCase() ? (
              <StyledBlurb>Please switch to the above wallet</StyledBlurb>
            ) : null}
            <div
              style={{
                alignSelf: 'center',
                marginTop: '18px'
              }}
            >
              <Button
                slim
                disabled={
                  this.props.activeAccount.address.toLowerCase() !==
                  this.props.hotAddress.toLowerCase()
                }
                onClick={() =>
                  this.props.approveLink({
                    hotAccount: this.props.activeAccount
                  })
                }
              >
                Sign
              </Button>
            </div>
          </Fragment>
        );
      case 5:
        return (
          <Fragment>
            <ProgressTabs progress={1} />
            <Transaction
              txHash={this.props.approveLinkTxHash}
              nextStep={this.nextStep}
              network={this.props.network}
            />
          </Fragment>
        );
      case 6:
        return (
          <Fragment>
            <ProgressTabs progress={2} />
            <StyledTop>
              <StyledTitle>Lock MKR</StyledTitle>
            </StyledTop>
            <StyledBlurb>
              Please select how much MKR you would like to lock in the secure
              voting contract. You can withdraw it at anytime
            </StyledBlurb>
            <StyledBlurb>
              (change back to your cold address if you'd like)
            </StyledBlurb>
            <div style={{ textAlign: 'center' }}>
              Your MKR Balance: {this.props.activeAccount.mkrBalance}
            </div>
            <StyledInput
              value={this.state.mkrAmountInput}
              onChange={this.updateInputValue}
              placeholder="MKR Amount"
            />
            <div
              style={{
                alignSelf: 'center',
                marginTop: '18px'
              }}
            >
              <Button
                slim
                onClick={() =>
                  this.props.sendMkrToProxy(this.state.mkrAmountInput)
                }
              >
                Lock
              </Button>
            </div>
          </Fragment>
        );
      case 7:
        return (
          <Fragment>
            <ProgressTabs progress={2} />
            <Transaction
              txHash={this.props.sendMkrTxHash}
              nextStep={this.nextStep}
              network={this.props.network}
            />
          </Fragment>
        );
      case 8:
        return (
          <Fragment>
            <ProgressTabs progress={3} />
            <StyledTop>
              <StyledTitle>Secure voting contract setup</StyledTitle>
            </StyledTop>
            <StyledBlurb>
              Your secure voting contract has been successfully set up. You can
              now voting using your hot wallet below. You can manage your secure
              voting contract by clicking Secure voting on the governance
              dashboard
            </StyledBlurb>
            <div style={{ textAlign: 'center' }}>
              Locked in voting contract: {this.state.mkrAmountInput}
            </div>
            <div
              style={{
                alignSelf: 'center',
                marginTop: '18px'
              }}
            >
              <Button
                slim
                onClick={() => {
                  this.props.modalClose();
                  this.props.proxyClear();
                  // temp measure to update proxy status
                  window.location.reload();
                }}
              >
                Finish and close
              </Button>
            </div>
          </Fragment>
        );
      default:
        return null;
    }
  }
}

ProxySetup.propTypes = {
  sendMkrToProxy: PropTypes.func.isRequired,
  initiateLinkTxHash: PropTypes.string,
  approveLinkTxHash: PropTypes.string,
  sendMkrToProxyTxHash: PropTypes.string
};

ProxySetup.defaultProps = {
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  sendMkrToProxyTxHash: ''
};

const stateProps = ({ modal, metamask, vote, accounts, proxy }) => ({
  modal: modal.modal,
  modalProps: modal.modalProps,
  account: metamask.accountAddress,
  accounts: accounts.allAccounts,
  activeAccount: getActiveAccount({ accounts }),
  network: metamask.network === 'kovan' ? 'kovan' : 'mainnet',
  initiateLinkTxHash: proxy.initiateLinkTxHash,
  sendMkrTxHash: proxy.sendMkrTxHash,
  approveLinkTxHash: proxy.approveLinkTxHash,
  hotAddress: proxy.hotAddress,
  voteTxHash: vote.txHash
});

const dispatchProps = {
  modalClose,
  initiateLink,
  approveLink,
  sendMkrToProxy,
  sendVote,
  proxyClear,
  trezorConnectInit
};

export default connect(
  stateProps,
  dispatchProps
)(ProxySetup);
