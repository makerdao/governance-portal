import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Button from "../Button";
import Card from "../Card";
import AccountBox from "../AccountBox";
import { responsive } from "../../styles";

const StyledContainer = styled.div`
  padding: 30px 26px;
  @media screen and (${responsive.sm.max}) {
    padding: 15px;
    & h4 {
      margin: 20px auto;
    }
  }
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

const StyledBlurb = styled.p`
  line-height: 22px;
  font-size: 17px;
  color: #868997;
  margin: 22px 0px 16px 0px;
`;

const StyledTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledMiddle = styled.div`
  display: flex;
  margin-top: 14px;
  margin-bottom: 20px;
  flex-direction: column;
  line-height: 26px;
`;

const SubHeading = styled.a`
  color: #868896;
`;

const Link = styled.a`
  color: #3080ed;
  font-size: 14px;
`;

const Column = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
`;

const StyledAnchor = styled.a`
  color: ${({ blue }) => (blue ? "#3080ed" : "#212536")};
  margin-bottom: -3px;
  border-bottom: 1px dashed ${({ blue }) =>
    blue ? "#2F80ED" : "#868997"}; #868997;
`;

const CircledNum = styled.div`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: #30bd9f;
  color: #fff;
  text-align: center;
  font-size: 17px;
  padding: 3px;
`;

const Section = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  margin-bottom: 22px;
`;

const GuideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin: 0px 20px;
  height: 210px;
  justify-content: space-between;
`;

const Guide = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const GuideTitle = styled.p`
  font-size: 20px;
  color: #212536;
`;

const GuideInfo = styled.p`
  font-size: 15px;
  color: #868997;
`;

const SetupLater = styled.p`
  font-size: 16px;
  text-align: center;
  color: #868997;
  cursor: pointer;
  margin-top: 18px;
`;

const InfoBox = styled.div`
  display: flex;
  border: 1px solid #dfe1e3;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f2f5fa;
  height: ${({ height }) => (height ? `${height}px` : "68px")};
`;

const InfoBoxSection = styled.div`
  width: 100%;
  padding: 12px;
`;

const InfoBoxHeading = styled.div`
  line-height: 26px;
  font-size: 14px;
  color: #868997;
`;

const InfoBoxContent = styled.div``;

class ProxySetup extends Component {
  state = {
    step: 1
  };

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  renderStep() {
    switch (this.state.step) {
      case false:
        return (
          <Column center maxWidth={540}>
            <StyledTitle>Welcome to the secure voting setup</StyledTitle>
            <StyledBlurb>
              Setting up your secure voting contract will enable you to keep
              your MKR stored safely in a{" "}
              <StyledAnchor>cold wallet</StyledAnchor> but be able to vote with
              your MKR via a <StyledAnchor>hot wallet</StyledAnchor>. The steps
              are as follows:
            </StyledBlurb>
            <GuideWrapper>
              <Section>
                <CircledNum>1</CircledNum>
                <Guide>
                  <GuideTitle>Link Wallets</GuideTitle>
                  <GuideInfo>Link your cold and hot wallets</GuideInfo>
                </Guide>
              </Section>
              <Section>
                <CircledNum>2</CircledNum>
                <Guide>
                  <GuideTitle>Lock MKR</GuideTitle>
                  <GuideInfo>Lock MKR in your secure voting contract</GuideInfo>
                </Guide>
              </Section>
              <Section>
                <CircledNum>3</CircledNum>
                <Guide>
                  <GuideTitle>Finish</GuideTitle>
                  <GuideInfo>Confirmation of set up</GuideInfo>
                </Guide>
              </Section>
            </GuideWrapper>
            <StyledBlurb>
              Its extremely secure and set up takes 5 minutes.{" "}
              <StyledAnchor blue>FAQ’s for more</StyledAnchor>
            </StyledBlurb>
            <Button slim onClick={this.nextStep}>
              Great get started
            </Button>
            <SetupLater onClick={this.props.modalClose}>
              Set up later
            </SetupLater>
          </Column>
        );
      case 1:
        return (
          <Fragment>
            <StyledTop>
              <StyledTitle>Set up</StyledTitle>
              <AccountBox
                accounts={[{ address: this.props.account, type: "MetaMask" }]}
              />
            </StyledTop>
            <StyledBlurb>
              You will be voting for DigixDAO CDP parameters: updating the dust,
              FOO and BAR limits due to recent events please confirm vote below.
              Vote can be withdrawn at anytime
            </StyledBlurb>
            <InfoBox>
              <InfoBoxSection>
                <InfoBoxHeading>Voting with</InfoBoxHeading>
              </InfoBoxSection>
              <InfoBoxSection>
                <InfoBoxHeading>Current vote</InfoBoxHeading>
              </InfoBoxSection>
              <InfoBoxSection>
                <InfoBoxHeading>After vote cast</InfoBoxHeading>
              </InfoBoxSection>
            </InfoBox>
          </Fragment>
        );
      default:
        return null;
    }
  }
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
  web3Available: PropTypes.bool
};

export default ProxySetup;
