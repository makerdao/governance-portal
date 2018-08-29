import React, { Component } from 'react';
import { connect } from 'react-redux';
import find from 'ramda/src/find';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

import { toSlug, eq } from '../utils/misc';
import { ethScanLink } from '../utils/ethereum';
import { toChecksum } from '../chain/web3';
import VoteTally from '../components/VoteTally';
import Vote from '../components/modals/Vote';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Timer from '../components/Timer';
import ClosedStatus from '../components/ClosedStatus';
import WithTally from '../components/hocs/WithTally';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import NotFound from './NotFound';
import theme, { colors } from '../theme';
import { formatDate, cutMiddle } from '../utils/misc';
import { modalOpen } from '../reducers/modal';

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
  animation: ${riseUp} 0.75s forwards;
`;

const WhiteBackground = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 34px;
  min-height: 311px;
  background-color: rgb(${colors.white});
  border-bottom: 2px solid #eaeaea;
  text-align: left;
`;

const StyledTop = styled.div`
  padding: 54px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1140px;
  margin: auto;
`;

const StyledTitle = styled.p`
  font-size: 28px;
  color: ${theme.text.darker_default};
  line-height: normal;
  font-weight: 500;
`;

const StyledBody = styled.p`
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 720px;
`;

const ConentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const RightPanels = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
`;

const DescriptionCard = styled(Card)`
  max-width: 750px;
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

const DetailsCard = styled(Card)`
  margin-bottom: 29px;
  height: 204px;
  font-size: ${({ theme }) => theme.fonts.size.medium};
  padding: 14px 20px;
`;

const SupporterCard = styled(Card)`
  padding: 14px 20px;
  height: 334px;
`;

const Detail = styled.p`
  color: ${({ theme }) => theme.text.dim_grey};
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 26px;
  font-size: 14px;
  &::after {
    content: ${({ pct }) => (pct ? '"%"' : '')};
  }
`;

const Address = styled.a`
  color: #2f80ed;
  line-height: 26px;
  font-size: 14px;
  max-width: 238px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Supporter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: ${theme.text.darker_default};
  line-height: 28px;
  margin-bottom: 6px;
`;

const SupporterWrapper = styled.div`
  overflow-y: scroll;
  height: 85%;
`;

const NoSupporters = styled.p`
  text-align: center;
  color: gray;
  font-size: 20px;
  margin-top: 105px;
  font-style: oblique;
`;

const LoadingWrapper = styled.div`
  padding: 25px 0;
`;

const StyledLink = styled(Link)`
  width: 80%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

class Proposal extends Component {
  state = {
    proposal: {},
    markdown: ''
  };

  componentDidMount() {
    const { topicSlug, proposalSlug } = this.props.match.params;
    const topic = find(
      ({ topic }) => toSlug(topic) === topicSlug,
      this.props.topics
    );
    if (topic === undefined) return; //not found
    const proposal = find(
      ({ title }) => toSlug(title) === proposalSlug,
      topic.proposals
    );
    if (proposal === undefined) return; //not found
    this.setState({
      proposal,
      parent: topic.topic,
      parentId: topic.id,
      active: topic.active
    });
    fetch(proposal.about)
      .then(response => response.text())
      .then(markdown => {
        this.setState({
          markdown
        });
      });
  }

  render() {
    const { proposal, markdown, parent, active, parentId } = this.state;
    if (Object.keys(proposal).length === 0) return <NotFound />;
    const {
      voteState,
      voteStateFetching,
      modalOpen,
      accountDataFetching,
      network,
      canVote,
      votingFor
    } = this.props;
    const networkShown = network === 'kovan' ? 'kovan' : 'mainnet';
    const supporters = voteState[proposal.source.toLowerCase()] || null;
    return (
      <RiseUp>
        <WhiteBackground>
          <StyledTop>
            <StyledCenter>
              <StyledTitle>{proposal.title}</StyledTitle>
              <StyledBody
                dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
              />
              {active ? (
                <Timer endTimestamp={proposal.end_timestamp} small mt="6" />
              ) : null}
            </StyledCenter>
            {active ? (
              <div>
                <WithTally candidate={proposal.source}>
                  {({ loadingApprovals, approvals, percentage }) => (
                    <VoteTally
                      statusBar
                      loadingApprovals={loadingApprovals}
                      approvals={approvals}
                      percentage={percentage}
                    />
                  )}
                </WithTally>
                <Button
                  disabled={!canVote || !active}
                  loading={accountDataFetching}
                  wide={true}
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
            ) : (
              <ClosedStatus
                topicId={parentId}
                proposalAddress={proposal.source}
              />
            )}
          </StyledTop>
        </WhiteBackground>
        <ConentWrapper>
          <DescriptionCard>
            {markdown ? (
              <ReactMarkdown
                className="markdown"
                skipHtml={true}
                source={markdown}
              />
            ) : (
              <div />
            )}
          </DescriptionCard>
          <RightPanels>
            <DetailsCard>
              <CardTitle>Details</CardTitle>
              <Supporter>
                <Detail>Topic</Detail>
                <StyledLink to={`/${toSlug(parent)}`}>{parent}</StyledLink>
              </Supporter>
              <Supporter>
                <Detail>Started</Detail>
                <Detail>{formatDate(proposal.date)}</Detail>
              </Supporter>
              <Supporter>
                <Detail>Source</Detail>
                <Address
                  target="_blank"
                  rel="noopener noreferrer"
                  href={ethScanLink(proposal.source, networkShown)}
                >
                  {cutMiddle(proposal.source, 8, 8)}
                </Address>
              </Supporter>
            </DetailsCard>
            <SupporterCard>
              <CardTitle>Top Supporters</CardTitle>
              <SupporterWrapper>
                {supporters ? (
                  supporters.map(supporter => (
                    <Supporter key={supporter.address}>
                      <Detail pct>{supporter.percent}</Detail>
                      <Address
                        target="_blank"
                        rel="noopener noreferrer"
                        href={ethScanLink(supporter.address, networkShown)}
                      >
                        {toChecksum(supporter.address)}
                      </Address>
                    </Supporter>
                  ))
                ) : voteStateFetching ? (
                  <LoadingWrapper>
                    <Loader size={20} color="header" background="white" />
                  </LoadingWrapper>
                ) : (
                  <NoSupporters>No supporters found</NoSupporters>
                )}
              </SupporterWrapper>
            </SupporterCard>
          </RightPanels>
        </ConentWrapper>
      </RiseUp>
    );
  }
}

const reduxProps = ({ topics, tally, accounts, metamask, hat }) => ({
  topics,
  voteStateFetching: tally.fetching,
  voteState: tally.tally,
  accountDataFetching: accounts.fetching,
  canVote: activeCanVote({ accounts }),
  votingFor: getActiveVotingFor({ accounts }),
  network: metamask.network
});

export default connect(
  reduxProps,
  { modalOpen }
)(Proposal);
