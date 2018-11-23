import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import VoterStatus from '../components/VoterStatus';
import { VotePercentage } from '../components/VoteTally';
import WithTally from '../components/hocs/WithTally';
import Button from '../components/Button';
import Card from '../components/Card';
import Timer from '../components/Timer';
import ClosedStatus from '../components/ClosedStatus';
import { toSlug, eq } from '../utils/misc';
import theme, { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import Vote from '../components/modals/Vote';

const riseUp = keyframes`
0% {
  opacity: 0;
  transform: translateY(15px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

const RiseUp = styled.div`
  animation: ${riseUp} 0.75s ease-in-out;
`;

const SubHeading = styled.p`
  color: ${theme.text.darker_default};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? 'block' : 'none')};
  }
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  height: 52px;
  color: #546978;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;

const Timeline = ({ modalOpen, proposals, canVote, fetching, votingFor }) => (
  <Fragment>
    <VoterStatus />
    <RiseUp key={proposals.toString()}>
      {proposals.map(proposal => (
        <StyledCard key={proposal.key}>
          <Card.Element key={proposal.title} height={151}>
            <ProposalDetails>
              <Link to={`/${toSlug(proposal.title)}`}>
                <SubHeading mt="-10">{proposal.title}</SubHeading>
              </Link>
              <Body
                dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
              />
              {proposal.active ? (
                <Timer endTimestamp={proposal.end_timestamp} small mb="-6" />
              ) : null}
            </ProposalDetails>
            <div>
              {proposal.active ? (
                <Fragment>
                  <WithTally candidate={proposal.source}>
                    {({ loadingApprovals, percentage }) => (
                      <VotePercentage
                        loadingApprovals={loadingApprovals}
                        percentage={percentage}
                      />
                    )}
                  </WithTally>
                  <Button
                    disabled={!canVote || !proposal.active}
                    loading={fetching}
                    onClick={() =>
                      modalOpen(Vote, {
                        proposal: {
                          address: proposal.source,
                          title: proposal.title
                        }
                      })
                    }
                  >
                    {eq(votingFor, proposal.source)
                      ? 'Withdraw vote'
                      : 'Vote for this Proposal'}
                  </Button>
                </Fragment>
              ) : (
                <ClosedStatus
                  topicKey={proposal.topicKey}
                  proposalAddress={proposal.source}
                />
              )}
            </div>
          </Card.Element>
        </StyledCard>
      ))}
    </RiseUp>
  </Fragment>
);

const reduxProps = ({ proposals, accounts, hat }, { signaling }) => {
  return {
    proposals: proposals.filter(p => !!p.govVote === !!signaling),
    canVote: activeCanVote({ accounts }),
    fetching: accounts.fetching,
    hatAddress: hat.hatAddress,
    votingFor: getActiveVotingFor({ accounts })
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
