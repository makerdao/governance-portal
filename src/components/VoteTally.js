import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import StatusBar from "./StatusBar";
import Button from "./Button";

const VoteTallyWrapper = styled.div``;

const StyledVoteTally = styled.div`
  line-height: 20px;
  color: #212536;
  font-size: 18px;
  margin-top: -10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const VotePercent = styled.div`
  &::after {
    font-size: 16px;
    color: #848484;
    content: " VOTES";
  }
`;

const VoteAmount = styled.div`
  &::after {
    font-size: 16px;
    color: #848484;
    content: " MKR";
  }
`;

const StyledStatusBar = styled(StatusBar)`
  margin-bottom: 15px;
  margin-top: -15px;
`;

const VoteTally = ({ wideButton, withStatusBar, ...props }) => (
  <VoteTallyWrapper {...props}>
    {withStatusBar ? <StyledStatusBar percentage={40} /> : null}
    <StyledVoteTally>
      <VotePercent>31.68%</VotePercent>
      <VoteAmount>11.4k</VoteAmount>
    </StyledVoteTally>
    <Button wide={wideButton}>Vote this Proposal</Button>
  </VoteTallyWrapper>
);

VoteTally.defaultProps = {
  wideButton: false,
  withStatusBar: false
};

export default VoteTally;
