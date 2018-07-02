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
  font-size: 20px;
  font-weight: bold;
  color: #212536;
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

const StyledBottom = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubHeading = styled.a`
  color: #868896;
`;

const StyledAddress = styled.a`
  color: #212536;
  font-size: 18px;
  font-weight: bold;
`;

const Link = styled.a`
  color: #3080ed;
  font-size: 14px;
`;

class ProxySetup extends Component {
  state = {
    step: 1
  };

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  renderStep() {
    switch (this.state.step) {
      case 1:
        return (
          <Fragment>
            <StyledTop>
              <StyledTitle>Set up secure voting </StyledTitle>
              <AccountBox
                account={this.props.account}
                web3Available={this.props.web3Available}
              />
            </StyledTop>
            <StyledMiddle>
              <SubHeading>
                You will be setting up a secure voting contract using
              </SubHeading>
              <StyledAddress>{this.props.account}</StyledAddress>
              <Link href="" target="_blank">
                View on Etherscan
              </Link>
            </StyledMiddle>
            <StyledBottom>
              <Button onClick={this.nextStep}>Set up voting contract</Button>
            </StyledBottom>
          </Fragment>
        );
      case 2:
        return (
          <Fragment>
            <StyledTop>
              <StyledTitle>Link Initiated</StyledTitle>
              <AccountBox
                account={this.props.account}
                web3Available={this.props.web3Available}
              />
            </StyledTop>
            <StyledMiddle>
              <SubHeading
                style={{ textAlign: "center", fontSize: "16px", margin: "6px" }}
              >
                Revisit this page with your hot wallet active & you'll be able
                to sign an approval transaction
              </SubHeading>
              <SubHeading
                style={{
                  textAlign: "center",
                  fontSize: "16px",
                  fontStyle: "oblique",
                  margin: "6px"
                }}
              >
                OR
              </SubHeading>
              <SubHeading
                style={{ textAlign: "center", fontSize: "16px", margin: "6px" }}
              >
                Visit the following link once your hot wallet is set up
              </SubHeading>
              {/* <StyledAddress>{this.props.account}</StyledAddress> */}
              <Link href="" target="_blank" style={{ textAlign: "center" }}>
                https://mkr.gov/link?0x0f79810Dea35Cc52569564D327C301919f779b90
              </Link>
            </StyledMiddle>
            {/* <StyledBottom>
              <Button onClick={this.nextStep}>Set up voting contract</Button>
            </StyledBottom> */}
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
