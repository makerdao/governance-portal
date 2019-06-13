import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';

import { toSlug } from '../utils/misc';
import Card from '../components/Card';
import VoterStatus from '../components/VoterStatus';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import NotFound from './NotFound';
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RightPanels = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
`;

const DescriptionCard = styled(Card)`
  margin: 0;
  max-width: 750px;
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

const VotingPanel = () => <div>Voting Panel</div>;

const DetailsPanel = () => <div>Details Panel</div>;

function Polling({ proposal, isValidRoute }) {
  if (isNil(proposal) || isEmpty(proposal) || !isValidRoute)
    return <NotFound />;
  return (
    <RiseUp>
      <VoterStatus />
      <ContentWrapper>
        <DescriptionCard>
          <ReactMarkdown
            className="markdown"
            skipHtml={true}
            source={proposal.about}
          />
        </DescriptionCard>
        <RightPanels>
          <VotingPanel />
          <DetailsPanel />
        </RightPanels>
      </ContentWrapper>
    </RiseUp>
  );
}

const reduxProps = ({ proposals, tally, accounts, metamask }, { match }) => {
  const { proposalSlug, topicSlug } = match.params;
  const proposal = proposals.find(
    ({ title, topicKey }) =>
      toSlug(title) === proposalSlug && topicKey === topicSlug
  );
  const isValidRoute = proposal && proposal.topicKey === topicSlug;

  return {
    proposal,
    voteStateFetching: tally.fetching,
    voteState: tally.tally,
    accountDataFetching: accounts.fetching,
    canVote: activeCanVote({ accounts }),
    votingFor: getActiveVotingFor({ accounts }),
    network: metamask.network,
    isValidRoute
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(Polling);
