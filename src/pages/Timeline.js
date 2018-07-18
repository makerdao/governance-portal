import React, { Fragment } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import DotSpacer from '../components/DotSpacer';
import VoterStatus from '../components/VoterStatus';
import VoteMeta from '../components/VoteMeta';
import VoteTally from '../components/VoteTally';
import WithTally from '../components/hocs/WithTally';
import Button from '../components/Button';
import Card from '../components/Card';
import { toSlug } from '../utils/misc';
import { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import Vote from '../components/modals/Vote';

const Heading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.xlarge};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? 'block' : 'none')};
  }
`;

const SubHeading = styled.p`
  color: #1f2c3c;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  justify-content: space-between;
`;

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;

const RootWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  align-items: center;
`;

const Timeline = ({ modalOpen, topics, activeAccount, fetching }) => (
  <Fragment>
    <VoterStatus />
    <StyledCard>
      <RootWrapper>
        <div>
          <Heading>Current Root Proposal</Heading>
          <div style={{ display: 'flex' }}>
            <a>See all system parameters</a>
            <DotSpacer />
            <a>What is the Root Proposal?</a>
          </div>
        </div>
        <Button
          disabled={!activeAccount || !activeAccount.proxy.isSetup}
          loading={fetching}
          onClick={() =>
            modalOpen(Vote, {
              proposal: {
                address: 0,
                title: 'Root Proposal'
              }
            })
          }
        >
          Vote for this Proposal
        </Button>
      </RootWrapper>
    </StyledCard>
    {topics.map(topic => (
      <StyledCard key={topic.topic}>
        <Card.Top
          active={topic.active}
          topicTitle={topic.topic}
          collapsable={true}
          startCollapsed={false}
        />
        {topic.proposals.map(proposal => (
          <Card.Element key={proposal.title} height={163}>
            <ProposalDetails>
              <Link to={`/${toSlug(topic.topic)}/${toSlug(proposal.title)}`}>
                <SubHeading>{proposal.title}</SubHeading>
              </Link>
              <Body>{proposal.proposal_blurb}</Body>
              <VoteMeta {...proposal} />
            </ProposalDetails>
            <div>
              <WithTally candidate={proposal.source}>
                {({
                  loadingApprovals,
                  loadingPercentage,
                  approvals,
                  percentage
                }) => (
                  <VoteTally
                    loadingPercentage={loadingPercentage}
                    loadingApprovals={loadingApprovals}
                    approvals={approvals}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button
                disabled={!activeAccount || !activeAccount.proxy.isSetup}
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
                Vote for this Proposal
              </Button>
            </div>
          </Card.Element>
        ))}
      </StyledCard>
    ))}
  </Fragment>
);

const reduxProps = ({ topics, accounts }) => ({
  topics,
  fetching: accounts.fetching,
  activeAccount: getActiveAccount({ accounts })
});

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
