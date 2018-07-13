import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import {
  StyledContainer,
  StyledCenter,
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Column,
  StyledAnchor,
  CircledNum,
  Section,
  GuideWrapper,
  Guide,
  GuideTitle,
  GuideInfo,
  SetupLater,
  InfoBox,
  InfoBoxSection,
  InfoBoxHeading,
  InfoBoxContent,
  ProgressTabsWrapper,
  TabsTitle,
  TabsTitleWrapper,
  TxHash,
  Styledinput
} from "./style";
import { ethScanLink } from "../../../utils/ethereum";
import Button from "../../Button";
import Card from "../../Card";
import Intro from "./Intro";
import Link from "./Link";

const ProgressTabs = ({ progress }) => (
  <ProgressTabsWrapper>
    <TabsTitleWrapper borderRight>
      <CircledNum dim={progress <= 0} p={-1} fontSize={14} size={22}>
        1
      </CircledNum>
      <TabsTitle>Link Wallets</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper borderRight>
      <CircledNum dim={progress <= 1} p={-1} fontSize={14} size={22}>
        2
      </CircledNum>
      <TabsTitle>Lock MKR</TabsTitle>
    </TabsTitleWrapper>
    <TabsTitleWrapper>
      <CircledNum dim={progress <= 2} p={-1} fontSize={14} size={22}>
        3
      </CircledNum>
      <TabsTitle>Finished</TabsTitle>
    </TabsTitleWrapper>
  </ProgressTabsWrapper>
);

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
    if (this.props.proxyCreationTxHash !== prevProps.proxyCreationTxHash)
      this.nextStep();
    if (this.props.mkrToProxyTxHash !== prevProps.mkrToProxyTxHash)
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
            <StyledTop>
              <StyledTitle>Transaction Hash</StyledTitle>
            </StyledTop>
            <TxHash
              href={ethScanLink(this.props.proxyCreationTxHash)}
              target="_blank"
            >
              {this.props.proxyCreationTxHash}
            </TxHash>
            <div
              style={{
                alignSelf: "center",
                marginTop: "18px"
              }}
            >
              <Button
                slim
                onClick={() => {
                  this.nextStep();
                }}
              >
                Continue
              </Button>
            </div>
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
              Your MKR Balance: {this.props.mkrBalance}
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
            <StyledTop>
              <StyledTitle>Transaction Hash</StyledTitle>
            </StyledTop>
            <TxHash
              href={ethScanLink(this.props.mkrToProxyTxHash)}
              target="_blank"
            >
              {this.props.mkrToProxyTxHash}
            </TxHash>
            <div
              style={{
                alignSelf: "center",
                marginTop: "18px"
              }}
            >
              <Button
                slim
                onClick={() => {
                  this.nextStep();
                }}
              >
                Continue
              </Button>
            </div>
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
              <Button
                slim
                onClick={() => {
                  this.props.modalClose();
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
  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, reject transaction, why did this tx fail
  render = () => (
    <Card maxWidth={600} background="white">
      <StyledContainer>
        <StyledCenter>{this.renderStep()}</StyledCenter>
      </StyledContainer>
    </Card>
  );
}

ProxySetup.propTypes = {
  account: PropTypes.string,
  createProxy: PropTypes.func,
  proxyCreationTxHash: PropTypes.string
};

ProxySetup.defaultProps = {
  proxyCreationTxHash: ""
};

export default ProxySetup;
