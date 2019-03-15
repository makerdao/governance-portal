import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import VoterStatus from '../components/VoterStatus';
import Button from '../components/Button';
import Card from '../components/Card';
import Timer from '../components/Timer';
import ClosedStatus from '../components/ClosedStatus';
import { toSlug, eq, formatDate, formatRound } from '../utils/misc';
import theme, { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import Vote from '../components/modals/Vote';
import TillHat from '../components/TillHatMeta';

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
`;

const TopicSubHeading = styled(SubHeading)`
  margin-bottom: 30px;
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
const StyledTopicCard = styled(Card)`
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 50px;
`;

const Tag = styled.p`
  padding: 1px 10px;
  border-radius: 4px;
  line-height: 21px;
  font-weight: bold;
  font-size: 14px;
  align-self: center;
  margin: auto;
  display: inline-block;
  margin-left: ${({ ml }) => (ml ? `${ml}px` : '')};
  background-color: ${({ green }) => (green ? '#c3f5ea' : '#FFE2D9')};
  color: ${({ green }) => (green ? '#30BD9F' : '#E45432')};
`;

const Timeline = ({
  modalOpen,
  proposals,
  canVote,
  fetching,
  votingFor,
  signaling,
  hat,
  approvals
}) => {
  const hatProposal = proposals.find(({ source }) => eq(source, hat.address));
  const otherProposals = proposals.filter(
    ({ source }) => !eq(source, hat.address)
  );
  otherProposals.sort((a, b) => b.end_timestamp - a.end_timestamp);

  const topicInfo = otherProposals.reduce((accumulator, current) => {
    if (!accumulator.find(({ topicKey }) => topicKey === current.topicKey)) {
      return [
        ...accumulator,
        {
          topicKey: current.topicKey,
          topicTitle: current.topicTitle
        }
      ];
    }
    return accumulator;
  }, []);

  return (
    <Fragment>
      <VoterStatus signaling={signaling} />
      <RiseUp key={otherProposals.toString()}>
        {signaling || !hatProposal ? null : (
          <StyledCard>
            <Card.Element height={164}>
              <ProposalDetails>
                <div style={{ display: 'flex' }}>
                  <Link to={`/${toSlug(hatProposal.title)}`}>
                    <SubHeading>{hatProposal.title}</SubHeading>
                  </Link>
                  <Tag ml="16" green>
                    GOVERNING PROPOSAL
                  </Tag>
                </div>
                <Body
                  dangerouslySetInnerHTML={{
                    __html: hatProposal.proposal_blurb
                  }}
                />
                <Link to={`/${toSlug(hatProposal.title)}`}>Read more...</Link>
                <div>
                  {!!hatProposal.end_approvals ? (
                    <Tag>{`Executed on ${formatDate(
                      hatProposal.end_timestamp
                    )} with ${formatRound(
                      hatProposal.end_approvals
                    )} MKR`}</Tag>
                  ) : (
                    <div>
                      <Tag>Available for execution</Tag>
                    </div>
                  )}
                </div>
              </ProposalDetails>
              <div>
                <Button
                  disabled={!canVote}
                  loading={fetching}
                  onClick={() =>
                    modalOpen(Vote, {
                      proposal: {
                        address: hat.address,
                        title: hatProposal.title
                      }
                    })
                  }
                >
                  {votingFor.includes(hat.address.toLowerCase())
                    ? 'Withdraw vote'
                    : 'Vote for no change'}
                </Button>
                <br />
                <TillHat candidate={hatProposal.source} />
              </div>
            </Card.Element>
          </StyledCard>
        )}
        {signaling
          ? topicInfo.map(({ topicKey, topicTitle }) => (
              <StyledTopicCard key={topicKey}>
                <TopicSubHeading>{topicTitle}</TopicSubHeading>
                {otherProposals.map(proposal =>
                  topicKey === proposal.topicKey ? (
                    <StyledCard key={proposal.key}>
                      <Card.Element key={proposal.title} height={164}>
                        <ProposalDetails>
                          <Link to={`/${toSlug(proposal.title)}`}>
                            <SubHeading>{proposal.title}</SubHeading>
                          </Link>
                          <Body
                            dangerouslySetInnerHTML={{
                              __html: proposal.proposal_blurb
                            }}
                          />
                          <Link to={`/${toSlug(proposal.title)}`}>
                            Read more...
                          </Link>
                          {hat.approvals <
                          approvals.approvals[proposal.source] ? (
                            <div>
                              <Tag>Available for execution</Tag>
                            </div>
                          ) : null}
                          {proposal.active && signaling ? (
                            <Timer
                              endTimestamp={proposal.end_timestamp}
                              small
                              mb="-6"
                            />
                          ) : null}
                        </ProposalDetails>
                        <div>
                          {proposal.active ? (
                            <Fragment>
                              <Button
                                disabled={
                                  !canVote ||
                                  (!proposal.active && proposal.govVote)
                                }
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
                                {votingFor.includes(
                                  proposal.source.toLowerCase()
                                )
                                  ? 'Withdraw vote'
                                  : 'Vote for this Proposal'}
                              </Button>
                              <br />
                              <TillHat candidate={proposal.source} />
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
                  ) : null
                )}
              </StyledTopicCard>
            ))
          : otherProposals.map(proposal => (
              <StyledCard key={proposal.key}>
                <Card.Element key={proposal.title} height={164}>
                  <ProposalDetails>
                    <Link to={`/${toSlug(proposal.title)}`}>
                      <SubHeading>{proposal.title}</SubHeading>
                    </Link>
                    <Body
                      dangerouslySetInnerHTML={{
                        __html: proposal.proposal_blurb
                      }}
                    />
                    <Link to={`/${toSlug(proposal.title)}`}>Read more...</Link>
                    {!!proposal.end_approvals ? (
                      <div>
                        <Tag>{`Executed on ${formatDate(
                          proposal.end_timestamp
                        )} with ${formatRound(
                          proposal.end_approvals
                        )} MKR`}</Tag>
                      </div>
                    ) : hat.approvals < approvals.approvals[proposal.source] ? (
                      <div>
                        <Tag>Available for execution</Tag>
                      </div>
                    ) : null}
                  </ProposalDetails>
                  <div>
                    <Fragment>
                      <Button
                        disabled={
                          !canVote || (!proposal.active && proposal.govVote)
                        }
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
                        {votingFor.includes(proposal.source.toLowerCase())
                          ? 'Withdraw vote'
                          : 'Vote for this Proposal'}
                      </Button>
                      <br />
                      <TillHat candidate={proposal.source} />
                    </Fragment>
                  </div>
                </Card.Element>
              </StyledCard>
            ))}
      </RiseUp>
    </Fragment>
  );
};

const reduxProps = ({ proposals, accounts, hat, approvals }, { signaling }) => {
  console.log('accounts', accounts);
  console.log(
    'getActiveVotingFor({ accounts }',
    getActiveVotingFor({ accounts })
  );
  return {
    hat,
    approvals,
    proposals: proposals.filter(p => !!p.govVote === !!signaling),
    canVote: activeCanVote({ accounts }),
    fetching: accounts.fetching,
    votingFor: getActiveVotingFor({ accounts })
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
