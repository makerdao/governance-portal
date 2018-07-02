import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Blockies from "react-blockies";

import { cutMiddle } from "../utils/misc";
import { fonts } from "../styles";

const StyledAccount = styled.div`
  color: white;
  background: ${({ dark }) => (dark ? "#053C4B" : "#435367")};
  border-radius: 4px;
  padding: 6px 10px;
  font-size: 15px;
  display: flex;
  width: 220px;
  align-items: center;
  font-weight: ${fonts.weight.normal};
  font-family: ${fonts.family.SFProText};
`;

const Account = styled.div`
  margin-left: 9px;
  margin: ${({ locked, web3Available }) =>
    locked || !web3Available ? "auto" : ""};
`;

// TODO: make more general for use w/ ledger and trezor
const AccountBox = ({ account, web3Available, dark, ...props }) => (
  <StyledAccount dark={dark} {...props}>
    {!!account ? (
      <Blockies
        seed={account}
        size={5}
        spotColor="#fc5e04"
        color="#fc5e04"
        bgColor="#fff"
      />
    ) : null}
    <Account locked={!account} web3Available={web3Available}>
      {web3Available
        ? !account
          ? "MetaMask locked "
          : "MetaMask "
        : "No MetaMask "}
      {cutMiddle(account)}
    </Account>
  </StyledAccount>
);

AccountBox.propTypes = {
  /**
   * Account
   */
  account: PropTypes.string,
  web3Available: PropTypes.bool
};

AccountBox.defaultProps = {
  account: "",
  web3Available: false
};

export default AccountBox;
