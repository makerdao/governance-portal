import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { colors, fonts } from "../styles";
import Modals from "../components/modals";
import Footer from "../components/Footer";
import AccountBox from "../components/AccountBox";
import logo from "../assets/logo.svg";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
`;
const AppWrapper = styled.div`
  padding: 0px 16px;
`;

const StyledColumn = styled.div`
  align-items: center;
  max-width: 1140px;
  margin: auto;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  width: 100%;
  height: 148px;
  display: block;
  align-items: center;
  background-color: rgb(${colors.header});
  color: rgb(${colors.white});
`;

const HeaderTop = styled.div`
  width: 100%;
  height: 83px;
  max-width: 1140px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0px auto;
`;

const HeaderBottom = styled.div`
  border-top: 1px solid #445162;
  height: 64px;
  width: 100%;
`;

const HeaderBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1140px;
  height: 100%;
  width: 100%;
  margin: 0px auto;
  align-items: center;
`;

const StyledTitle = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.large};
  margin-left: 12px;
`;

const HeaderBottomLeft = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
`;

const MakerLinks = styled.div``;

const StyledAnchor = styled.a`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
  margin: 0px 49px;
  margin-right: ${({ edge }) => (!!edge && edge === "right" ? "0px" : "")};
  margin-left: ${({ edge }) => (!!edge && edge === "left" ? "0px" : "")};
`;

const StyledContent = styled.div`
  width: 100%;
`;

const StyledLogo = styled.div`
  height: 36px;
  width: 36px;
  cursor: pointer;
  background: url(${logo}) no-repeat;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const Padding = styled.div`
  height: 100px;
`;

const BaseLayout = ({ children, account, web3Available }) => (
  <StyledLayout>
    <StyledHeader>
      <HeaderTop>
        <StyledLink to="/">
          <StyledLogo />
          <StyledTitle>MAKER</StyledTitle>
        </StyledLink>
        <MakerLinks>
          <StyledAnchor href="/" target="_blank" edge={"left"}>
            Products
          </StyledAnchor>
          <StyledAnchor href="https://makerdao.com/whitepaper/" target="_blank">
            Learn
          </StyledAnchor>
          <StyledAnchor href="https://makerdao.com" target="_blank">
            Company
          </StyledAnchor>
          <StyledAnchor
            href="https://chat.makerdao.com/channel/collateral-discuss"
            target="_blank"
            edge={"right"}
          >
            Community
          </StyledAnchor>
        </MakerLinks>
      </HeaderTop>
      <HeaderBottom>
        <HeaderBottomContent>
          <StyledLink to="/">
            <HeaderBottomLeft>Governance</HeaderBottomLeft>
          </StyledLink>
          <AccountBox
            web3Available={web3Available}
            accounts={[
              { address: account, type: "MetaMask" },
              { address: "0x8193704982a089", type: "Ledger" }
            ]}
          />
        </HeaderBottomContent>
      </HeaderBottom>
    </StyledHeader>
    <AppWrapper>
      <StyledColumn>
        <StyledContent>{children}</StyledContent>
        {/* <Footer /> */}
        <Padding />
      </StyledColumn>
    </AppWrapper>
    <Modals />
  </StyledLayout>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  account: PropTypes.string,
  web3Available: PropTypes.bool
};

const reduxProps = ({ metamask }) => ({
  account: metamask.accountAddress,
  web3Available: metamask.web3Available
});

export default connect(
  reduxProps,
  {}
)(BaseLayout);
