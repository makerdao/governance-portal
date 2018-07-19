import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

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
    if (this.props.sendMkrToProxyTxHash !== prevProps.sendMkrToProxyTxHash)
      this.nextStep();
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
            {this.props.activeAccount.address !== this.props.hotAddress ? (
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
                  this.props.activeAccount.address !== this.props.hotAddress
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
            <div style={{ textAlign: 'center' }}>
              {/* Your MKR Balance: {this.props.mkrBalance} */}
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
              txHash={this.props.mkrToProxyTxHash}
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

export default ProxySetup;
