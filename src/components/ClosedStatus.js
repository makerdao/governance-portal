import React from 'react';
// import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

import Loader from './Loader';
import { eq, formatDate, formatRound } from '../utils/misc';
import { getWinningProp } from '../reducers/proposals';

const fadeIn = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 0.75s forwards;
`;

export const GreyBox = styled.div`
  display: flex;
  font-weight: 600;
  overflow: hidden;
  background-color: #eaeff7;
  flex-direction: column;
  padding: 10px;
  border-radius: 2px;
`;

const Row = styled.strong`
  margin: ${({ center }) => (center ? `auto` : '')};
  display: flex;
`;

export const Key = styled.div`
  margin: ${({ center }) => (center ? `auto` : '')};
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
  font-style: ${({ oblique }) => (oblique ? `oblique` : '')};
  font-size: 14px;
  color: #546978;
`;

export const Value = styled.div`
  font-size: 14px;
  color: #272727;
`;

const WinningTag = styled.div`
  padding: 2px 15px;
  border-radius: 20px;
  line-height: 24px;
  align-self: center;
  background-color: #d2f9f1;
  color: #30bd9f;
  &::after {
    content: 'Winning proposal';
  }
`;

const TagWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
`;

const ClosedProposal = ({
  winningProposal,
  approvalFetching,
  proposalAddress
}) => {
  if (approvalFetching)
    return <Loader mr={70} size={20} color="header" background="white" />;
  if (!eq(proposalAddress, winningProposal.source) || winningProposal === null)
    return null;
  return (
    <FadeIn>
      <TagWrapper>
        <WinningTag />
      </TagWrapper>
      <GreyBox>
        <React.Fragment>
          <Key center oblique>
            Approved
          </Key>
          <Row center>
            <Key mr={6}>on</Key>{' '}
            <Value>{formatDate(winningProposal.end_timestamp)}</Value>
          </Row>
          <Row center>
            <Key mr={6}>with</Key>{' '}
            <Value>{formatRound(winningProposal.end_approvals)} MKR</Value>
          </Row>{' '}
        </React.Fragment>
      </GreyBox>
    </FadeIn>
  );
};

const mapStateToProps = ({ proposals, approvals }, props) => ({
  approvalFetching: approvals.fetching,
  winningProposal: getWinningProp({ approvals, proposals }, props.topicKey)
});

export default connect(
  mapStateToProps,
  {}
)(ClosedProposal);
