import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import {
  StyledContainer,
  StyledCenter,
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Styledinput
} from "../shared/styles";
import Button from "../../Button";
import Card from "../../Card";
import Intro from "./Intro";
import Link from "./Link";
import Transaction from "../shared/Transaction";
import ProgressTabs from "./ProgressTabs";

class ProxySetup extends Component {
  state = {
    step: 1,
    mkrAmountInput: ""
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

  renderStep() {
    switch (this.state.step) {
      case 1:
        return (
          <Intro modalClose={this.props.modalClose} nextStep={this.nextStep} />
        );
      case 2:
        window.scrollTo(0, 0);
        return <Link createProxy={this.props.createProxy} />;
      case 3:
        return (
          <Fragment>
            <ProgressTabs progress={1} />
            <Transaction
              txHash={this.props.proxyCreationTxHash}
              nextStep={this.nextStep}
            />
          </Fragment>
        );
      case 4:
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
            <div style={{ textAlign: "center" }}>
              {/* Your MKR Balance: {this.props.mkrBalance} */}
            </div>
            <Styledinput
              value={this.state.mkrAmountInput}
              onChange={this.updateInputValue}
              placeholder="MKR Amount"
            />
            <div
              style={{
                alignSelf: "center",
                marginTop: "18px"
              }}
            >
              <Button
                slim
                onClick={() => {
                  this.props.userSendMkrToProxy(this.state.mkrAmountInput);
                }}
              >
                Lock
              </Button>
            </div>
          </Fragment>
        );
      case 5:
        return (
          <Fragment>
            <ProgressTabs progress={2} />
            <Transaction
              txHash={this.props.mkrToProxyTxHash}
              nextStep={this.nextStep}
            />
          </Fragment>
        );
      case 6:
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
            <div style={{ textAlign: "center" }}>
              Locked in voting contract: {this.state.mkrAmountInput}
            </div>
            <div
              style={{
                alignSelf: "center",
                marginTop: "18px"
              }}
            >
              <Button slim onClick={this.props.modalClose}>
                Finish and close
              </Button>
            </div>
          </Fragment>
        );
      default:
        return null;
    }
  }
  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, check balances, etc
  render = () => (
    <Card maxWidth={600} background="white">
      <StyledContainer>
        <StyledCenter>{this.renderStep()}</StyledCenter>
      </StyledContainer>
    </Card>
  );
}

ProxySetup.propTypes = {
  modalClose: PropTypes.func.isRequired,
  sendMkrToProxy: PropTypes.func.isRequired,
  initiateLinkTxHash: PropTypes.string,
  approveLinkTxHash: PropTypes.string,
  sendMkrToProxyTxHash: PropTypes.string
};

ProxySetup.defaultProps = {
  initiateLinkTxHash: "",
  approveLinkTxHash: "",
  sendMkrToProxyTxHash: ""
};

export default ProxySetup;
