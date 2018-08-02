import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import VoterStatus from '../components/VoterStatus';
import { VotePercentage } from '../components/VoteTally';
import WithTally from '../components/hocs/WithTally';
import Button from '../components/Button';
import Card from '../components/Card';
import Timer from '../components/Timer';
import { toSlug, eq } from '../utils/misc';
import theme, { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import Vote from '../components/modals/Vote';

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

const Timeline = ({ modalOpen, topics, canVote, fetching, votingFor }) => (
  <Fragment>
    <VoterStatus />
    {topics.map(topic => (
      <Fragment key={topic.topic}>
        {topic.active ? <Timer endTimestamp={topic.end_timestamp} /> : null}
        <StyledCard key={topic.topic}>
          <Card.Top
            govVote={topic.govVote}
            active={topic.active}
            topicTitle={topic.topic}
            collapsable={true}
            startCollapsed={false}
          />
          {topic.proposals.map(proposal => (
            <Card.Element key={proposal.title} height={151}>
              <ProposalDetails>
                <Link to={`/${toSlug(topic.topic)}/${toSlug(proposal.title)}`}>
                  <SubHeading mt="-10">{proposal.title}</SubHeading>
                </Link>
                <Body
                  dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
                />
                {topic.active ? (
                  <Timer endTimestamp={proposal.end_timestamp} small mb="-6" />
                ) : null}
              </ProposalDetails>
              <div>
                <WithTally candidate={proposal.source}>
                  {({ loadingApprovals, percentage }) => (
                    <VotePercentage
                      loadingApprovals={loadingApprovals}
                      percentage={percentage}
                    />
                  )}
                </WithTally>
                <Button
                  disabled={!canVote}
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
              </div>
            </Card.Element>
          ))}
        </StyledCard>
      </Fragment>
    ))}
  </Fragment>
);

const reduxProps = ({ topics, accounts, hat }) => ({
  topics,
  canVote: activeCanVote({ accounts }),
  fetching: accounts.fetching,
  hatAddress: hat.hatAddress,
  votingFor: getActiveVotingFor({ accounts })
});

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
