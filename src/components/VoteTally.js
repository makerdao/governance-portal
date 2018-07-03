import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import StatusBar from "./StatusBar";
import Button from "./Button";
import Loader from "./Loader";

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
  display: flex;
  &::after {
    margin-left: 4px;
    font-size: 16px;
    color: #848484;
    content: " VOTES";
  }
`;

const VoteAmount = styled.div`
  &::after {
    font-size: 16px;
    color: #848484;
    white-space: pre;
    content: " Approvals";
  }
`;

const StyledStatusBar = styled(StatusBar)`
  margin-bottom: 15px;
  margin-top: -15px;
`;

const VoteTally = ({
  wideButton,
  withStatusBar,
  loadingApprovals,
  loadingPercentage,
  percentage,
  approvals,
  ...props
}) => (
  <VoteTallyWrapper {...props}>
    {withStatusBar ? <StyledStatusBar percentage={percentage} /> : null}
    <StyledVoteTally>
      <VotePercent>
        {loadingPercentage ? (
          <Loader size={20} color="light_grey" background="white" />
        ) : (
          `${percentage}%`
        )}
      </VotePercent>
      <VoteAmount>
        {loadingApprovals ? (
          <Loader size={20} color="light_grey" background="white" />
        ) : (
          `${approvals}`
        )}
      </VoteAmount>
    </StyledVoteTally>
    <Button wide={wideButton}>Vote this Proposal</Button>
  </VoteTallyWrapper>
);

VoteTally.defaultProps = {
  wideButton: false,
  withStatusBar: false,
  loadingPercentage: false,
  loadingApprovals: false,
  approvals: 0,
  percentage: 0
};

export default VoteTally;
