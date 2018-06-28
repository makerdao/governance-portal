import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import Blockies from "react-blockies";

import { colors, fonts } from "../styles";
import { cutMiddle } from "../utils/misc";

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

const AddressBlock = styled.div`
  color: white;
  background: #435367;
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 15px;
  display: flex;
  margin-left: auto;
`;

const Account = styled.div`
  &::before {
    white-space: pre;
    content: ${({ locked }) =>
      locked ? `"  MetaMask locked "` : `"  MetaMask "`};
  }
`;

const StyledBlockies = styled(Blockies)`
  float: left;
`;

const BaseLayout = ({ children, account }) => (
  <StyledLayout>
    <StyledHeader>
      <HeaderContent>
        <div />
        <StyledTitle>Maker Voting</StyledTitle>
        <AddressBlock>
          <StyledBlockies
            seed={account}
            size={5}
            spotColor="#fc5e04"
            color="#fc5e04"
            bgColor="#fff"
          />
          <Account locked={!account}>{cutMiddle(account)}</Account>
        </AddressBlock>
      </HeaderContent>
    </StyledHeader>
    <AppWrapper>
      <StyledColumn>
        <StyledContent>{children}</StyledContent>
      </StyledColumn>
    </AppWrapper>
  </StyledLayout>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

const reduxProps = ({ metamask }) => ({
  account: metamask.accountAddress
});

export default connect(
  reduxProps,
  {}
)(BaseLayout);
