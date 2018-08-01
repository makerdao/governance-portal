import React, { Component } from 'react';
import { connect } from 'react-redux';
import find from 'ramda/src/find';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

import { toSlug } from '../utils/misc';
import { ethScanLink } from '../utils/ethereum';
import VoteTally from '../components/VoteTally';
import Vote from '../components/modals/Vote';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import Timer from '../components/Timer';
import WithTally from '../components/hocs/WithTally';
import { activeCanVote } from '../reducers/accounts';
import NotFound from './NotFound';
import theme, { colors } from '../theme';
import { formatDate, cutMiddle } from '../utils/misc';
import { modalOpen } from '../reducers/modal';

const WhiteBackground = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 34px;
  height: 311px;
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
  line-height: 33px;
  font-weight: 500;
`;

const StyledBody = styled.p`
  line-height: 30px;
  font-size: 17px;
  color: #546978;
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
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
  height: 100%;
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
    this.setState({ proposal, parent: topic.topic });
    fetch(proposal.about)
      .then(response => response.text())
      .then(markdown => {
        this.setState({
          markdown
        });
      });
  }

  render() {
    const { proposal, markdown, parent } = this.state;
    if (Object.keys(proposal).length === 0) return <NotFound />;
    const {
      voteState,
      voteStateFetching,
      modalOpen,
      accountDataFetching,
      network,
      canVote,
      hatApprovals
    } = this.props;
    const networkShown = network === 'kovan' ? 'kovan' : 'mainnet';
    const supporters = voteState[proposal.source.toLowerCase()] || null;
    return (
      <React.Fragment>
        <WhiteBackground>
          <StyledTop>
            <StyledCenter>
              <StyledTitle>{proposal.title}</StyledTitle>
              <StyledBody
                dangerouslySetInnerHTML={{ __html: proposal.proposal_blurb }}
              />
              {parent.active ? (
                <Timer endTimestamp={proposal.end_timestamp} small mt="-22" />
              ) : null}
            </StyledCenter>
            <div>
              <WithTally candidate={proposal.source}>
                {({
                  loadingApprovals,
                  loadingPercentage,
                  approvals,
                  percentage
                }) => (
                  <VoteTally
                    statusBar
                    loadingPercentage={loadingPercentage}
                    loadingApprovals={loadingApprovals}
                    approvals={approvals}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button
                disabled={!canVote}
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
                Vote for this Proposal
              </Button>
            </div>
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
                <Link to={`/${toSlug(parent)}`}>{parent}</Link>
              </Supporter>
              <Supporter>
                <Detail>Started</Detail>
                <Detail>{formatDate(proposal.date)}</Detail>
              </Supporter>
              <Supporter>
                <Detail>Source</Detail>
                <Address
                  target="_blank"
                  href={ethScanLink(proposal.source, networkShown)}
                >
                  {cutMiddle(proposal.source, 8, 8)}
                </Address>
              </Supporter>
              <WithTally candidate={proposal.source}>
                {({ approvals }) => (
                  <Supporter>
                    <Detail>Till Hat</Detail>
                    {hatApprovals !== 0 ? (
                      <Detail>
                        {(hatApprovals - approvals).toLocaleString()} MKR
                      </Detail>
                    ) : (
                      <Detail>---</Detail>
                    )}
                  </Supporter>
                )}
              </WithTally>
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
                        href={ethScanLink(supporter.address, networkShown)}
                      >
                        {supporter.address}
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
      </React.Fragment>
    );
  }
}

const reduxProps = ({ topics, tally, accounts, metamask, hat }) => ({
  topics,
  voteStateFetching: tally.fetching,
  voteState: tally.tally,
  accountDataFetching: accounts.fetching,
  canVote: activeCanVote({ accounts }),
  network: metamask.network,
  hatApprovals: hat.hatApprovals
});

export default connect(
  reduxProps,
  { modalOpen }
)(Proposal);
