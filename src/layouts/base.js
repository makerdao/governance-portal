import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

import { colors, fonts } from "../styles";
import Modals from "../components/modals";
import AccountBox from "../components/AccountBox";

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
  max-width: 1000px;
  align-items: center;
  max-width: 1140px;
  margin: auto;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  background-color: rgb(${colors.header});
  justify-content: center;
  padding: 0 16px;
`;

const HeaderContent = styled.div`
  width: 1140px;
  align-items: center;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
`;

const StyledTitle = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.xlarge};
`;

const StyledContent = styled.div`
  width: 100%;
`;

const Footer = styled.div`
  height: 100px;
`;

const BaseLayout = ({ children, account, web3Available }) => (
  <StyledLayout>
    <StyledHeader>
      <HeaderContent>
        <div />
        <StyledTitle>Maker Voting</StyledTitle>
        <AccountBox web3Available={web3Available} account={account} />
      </HeaderContent>
    </StyledHeader>
    <AppWrapper>
      <StyledColumn>
        <StyledContent>{children}</StyledContent>
        <Footer />
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
