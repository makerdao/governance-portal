import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';
import { Grid } from '@makerdao/ui-components';
import arrow from '../imgs/arrow.svg';
import { toSlug } from '../utils/misc';
import Button from '../components/Button';
import Card from '../components/Card';
import ClickOutside from '../components/ClickOutside';
import VoterStatus from '../components/VoterStatus';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import NotFound from './NotFound';
import { modalOpen } from '../reducers/modal';
import theme, { colors } from '../theme';
import { cutMiddle } from '../utils/misc';

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

const VoteSelection = styled.div`
  display: flex;
  flex-diretion: row;
  justify-content: space-between;
`;

const DetailsPanelCard = styled(Card)`
  margin-bottom: 29px;
  font-size: ${({ theme }) => theme.fonts.size.medium};
  padding: 14px 20px;
`;

const DescriptionCard = styled(Card)`
  margin: 0;
  max-width: 750px;
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

const CardTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: ${theme.text.darker_default};
  line-height: 28px;
  margin-top: 20px;
  margin-bottom: 6px;
`;

const StyledArrow = styled.img`
  margin-left: 0.7em;
  position: relative;
  top: 1px;
  cursor: pointer;
  width: 14px;
  height: 10px;
  mask: url(${arrow}) center no-repeat;
  mask-size: 90%;
  background-color: rgb(${colors['green']});
`;

const VoteStatusText = styled.p`
  margin-top: 10px;
  margin-bottom: 35px;
  text-align: left;
  line-height: 2;
  font-size: 14px;
`;

const Black = styled.span`
  color: ${theme.text.default};
`;

const Strong = styled(Black)`
  color: ${theme.text.default};
  font-weight: bold;
`;

const Blue = styled.span`
  color: ${theme.text.blue_link};
  cursor: pointer;
`;

const DetailsItem = styled(Black)`
  display: flex;
  flex-direction: row;
  padding: 8px 0px;
  font-size: 15px;
  border-bottom: 1px solid rgb(${colors['light_grey2']});
  &:last-child {
    border-bottom: none;
  }
`;

const DetailsCardText = styled.p`
  width: 110px;
  color: rgb(${colors['grey']});
  font-size: 15px;
`;

const DetailsCardItem = ({ name, value, other }) => (
  <DetailsItem>
    <DetailsCardText>{name}</DetailsCardText>
    {value ? value : other}
  </DetailsItem>
);

const VotingPanel = ({ proposal }) => (
  <React.Fragment>
    <VoteSelection>
      <ClickOutside>
        <Button bgColor="white" width="195px">
          Please choose...
          <StyledArrow />
        </Button>
      </ClickOutside>
      <Button
        bgColor="green"
        color="white"
        hoverColor="white"
        width="135px"
        disabled={proposal.active}
      >
        Vote Now
      </Button>
    </VoteSelection>
    <VoteStatusText>
      <Black>Currently voting:</Black>
      &nbsp;
      <Strong>17.5%</Strong>
      &nbsp;
      <Black>|</Black>
      &nbsp; &nbsp;
      <Blue onClick={() => null}>Withdraw Vote</Blue>
    </VoteStatusText>
  </React.Fragment>
);

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
          <VotingPanel proposal />
          <DetailsPanelCard style={{ padding: '0px 30px 15px 30px' }}>
            <CardTitle>Details</CardTitle>
            {[
              {
                name: 'Source',
                other: <Blue>{cutMiddle(proposal.source, 8, 8)}</Blue>
              },
              { name: 'Started', value: '12 Sept 18' },
              { name: 'Duration', value: '3 days' },
              { name: 'Questions?', other: <Blue>Governance FAQ's</Blue> }
            ].map((item, i) => (
              <DetailsCardItem key={i} {...item} />
            ))}
            <CardTitle>Voting Stats</CardTitle>
            {[
              { name: 'Total votes', value: '200,324.43 MKR' },
              { name: 'Participation', value: '20.1%' },
              { name: 'Unique voters', value: '1041' }
            ].map((item, i) => (
              <DetailsCardItem key={i} {...item} />
            ))}
            <CardTitle>Vote breakdown</CardTitle>
            {[
              { name: '17.5%', value: '170,324 MKR (82%)' },
              { name: '19.5%', value: '20,520 MKR (12%)' },
              { name: 'No change', value: '100 MKR (0.5%)' },
              { name: '14.5%', value: '0 MKR' },
              { name: '15.5%', value: '0 MKR' },
              { name: '16.5%', value: '0 MKR' }
            ].map((item, i) => (
              <DetailsCardItem key={i} {...item} />
            ))}
          </DetailsPanelCard>
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
