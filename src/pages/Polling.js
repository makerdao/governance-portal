import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';

import { toSlug } from '../utils/misc';
import { ethScanLink } from '../utils/ethereum';
import Vote from '../components/modals/Vote';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import VoterStatus from '../components/VoterStatus';
import Timer from '../components/Timer';
import ClosedStatus from '../components/ClosedStatus';
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
  @media screen and (max-width: 1199px) {
    width: 103%;
    left: 0px;
    right: 0px;
    margin-left: -16px;
    margin-right: 0px;
  }
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

const toChecksumAddress = address => {
  const { toChecksumAddress } = window.maker.service('web3')._web3.utils;
  return toChecksumAddress(address);
};

const VotingPanel = () => <div>Voting Panel</div>;

const DetailsPanel = () => <div>Details Panel</div>;

function Polling({
  proposal,
  voteState,
  voteStateFetching,
  modalOpen,
  accountDataFetching,
  network,
  canVote,
  votingFor,
  isValidRoute
}) {
  if (isNil(proposal) || isEmpty(proposal) || !isValidRoute)
    return <NotFound />;
  const { active, topicKey } = proposal;
  const supporters = voteState[proposal.source.toLowerCase()] || null;
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
