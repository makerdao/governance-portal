import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Blockies from "react-blockies";

import { cutMiddle } from "../utils/misc";
// import { colors, fonts, transitions } from "../styles";

const StyledAccount = styled.div`
  color: white;
  background: ${({ dark }) => (dark ? "#053C4B" : "#435367")};
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 15px;
  display: flex;
  margin-left: auto;
`;

const Account = styled.div`
  &::before {
    white-space: pre;
    content: ${({ locked, web3Available }) =>
      web3Available
        ? locked
          ? `"  MetaMask locked "`
          : `"  MetaMask "`
        : `"  No MetaMask "`};
  }
`;

const AccountBox = ({ account, web3Available, dark }) => (
  <StyledAccount dark={dark}>
    <Blockies
      seed={account || "seed"}
      size={5}
      spotColor="#fc5e04"
      color="#fc5e04"
      bgColor="#fff"
    />
    <Account web3Available={web3Available} locked={!account}>
      {cutMiddle(account)}
    </Account>
  </StyledAccount>
);

AccountBox.propTypes = {
  account: PropTypes.string,
  web3Available: PropTypes.bool
};

AccountBox.defaultProps = {
  account: "",
  web3Available: false
};

export default AccountBox;
