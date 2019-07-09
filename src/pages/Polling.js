import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';
import { toSlug } from '../utils/misc';
import Button from '../components/Button';
import Card from '../components/Card';
import VoterStatus from '../components/VoterStatus';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import NotFound from './NotFound';
import { modalOpen } from '../reducers/modal';
import theme, { colors } from '../theme';
import { cutMiddle } from '../utils/misc';
import ExternalLink from '../components/Onboarding/shared/ExternalLink';
import { ethScanLink } from '../utils/ethereum';
import Dropdown from '../components/Dropdown';

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

const DropdownText = styled.p`
  margin-left: 20px;
  margin-right: 20px;
  color: ${({ color }) => (color ? `rgb(${colors[color]})` : 'black')};
`;

const DetailsCardItem = ({ name, value, component }) => (
  <DetailsItem>
    <DetailsCardText>{name}</DetailsCardText>
    {value ? value : component}
  </DetailsItem>
);

class VotingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'Please choose...'
    };
  }

  onDropdownSelect = value => {
    console.log('***value', value);
    this.setState({
      selectedOption: value
    });
  };

  formatOptions = options => {
    const displayOptions = [...options];
    displayOptions.shift();
    return displayOptions;
  };

  render() {
    const poll = this.props.poll;
    const { options } = poll;

    const selectedOption = this.state.selectedOption;
    //TODO: fix dropdown resizing issue
    return (
      <React.Fragment>
        <VoteSelection>
          <Dropdown
            color="green"
            items={this.formatOptions(options)}
            renderItem={item => (
              <DropdownText color="green">{item}</DropdownText>
            )}
            renderRowItem={item => <DropdownText>{item}</DropdownText>}
            value={selectedOption}
            onSelect={this.onDropdownSelect}
          />
          <Button
            bgColor="green"
            color="white"
            hoverColor="white"
            width="135px"
            disabled={!poll.active}
          >
            Vote Now
          </Button>
        </VoteSelection>
      </React.Fragment>
    );
  }
}

const timeLeft = (startTime, endTime) => {
  const timeLeft = Math.floor(endTime / 1000) - Math.floor(startTime / 1000);
  const days = Math.floor(timeLeft / (3600 * 24));
  return days !== 1 ? `${days} days` : `${days} day`;
};

function Polling({
  voteState,
  voteStateFetching,
  modalOpen,
  accountDataFetching,
  network,
  canVote,
  votingFor,
  isValidRoute,
  poll
}) {
  if (isNil(poll) || isEmpty(poll) || !isValidRoute) return <NotFound />;
  console.log('this poll', poll);

  // TODO: implement this after user>poll query is implemented in accounts reducer:
  const votedPollOption = undefined;
  const { discussionLink } = poll;

  return (
    <RiseUp>
      <VoterStatus />
      <ContentWrapper>
        <DescriptionCard>
          <ReactMarkdown
            className="markdown"
            skipHtml={true}
            source={poll.content}
          />
        </DescriptionCard>
        <RightPanels>
          {poll.active && <VotingPanel poll={poll} />}
          {votedPollOption ? (
            <VoteStatusText>
              <Black>
                {poll.active ? 'Currently voting: ' : 'Voted for: '}
              </Black>
              <Strong>{votedPollOption} </Strong>
              {poll.active && (
                <Fragment>
                  <Black>| </Black>
                  <Blue onClick={() => null}>Withdraw Vote</Blue>
                </Fragment>
              )}
            </VoteStatusText>
          ) : (
            <VoteStatusText>
              <Black>
                {poll.active ? 'Not currently voting' : 'You did not vote'}
              </Black>
            </VoteStatusText>
          )}
          <DetailsPanelCard style={{ padding: '0px 30px 15px 30px' }}>
            <CardTitle>Details</CardTitle>
            {[
              {
                name: 'Source',
                component: (
                  <ExternalLink
                    href={ethScanLink(poll.source, network)}
                    target="_blank"
                  >
                    {cutMiddle(poll.source, 8, 8)}
                  </ExternalLink>
                )
              },
              { name: 'Started', value: poll.startTime.toDateString() },
              {
                name: 'Duration',
                value: timeLeft(poll.startTime, poll.endTime)
              },
              {
                name: 'Questions?',
                component: (
                  <ExternalLink href="https://makerdao.com/en/" target="_blank">
                    Governance FAQ's
                  </ExternalLink>
                )
              },
              {
                name: 'Discussion',
                component: (
                  <ExternalLink href={discussionLink} target="_blank">
                    Here
                  </ExternalLink>
                ),
                hide: !discussionLink
              }
            ].map((item, i) => {
              if (!item.hide) {
                return <DetailsCardItem key={i} {...item} />;
              }
            })}

            <CardTitle>Voting Stats</CardTitle>
            {[
              { name: 'Total votes', value: `${poll.totalVotes} MKR` },
              {
                name: 'Participation',
                value: isNaN(poll.participation) ? '' : `${poll.participation}%`
              },
              { name: 'Unique voters', value: poll.numUniqueVoters }
            ].map((item, i) => (
              <DetailsCardItem key={i} {...item} />
            ))}

            {poll.voteBreakdown && (
              <>
                <CardTitle>Vote breakdown</CardTitle>
                {poll.voteBreakdown.map((item, i) => (
                  <DetailsCardItem key={i} {...item} />
                ))}
              </>
            )}
            {poll.legacyPoll && (
              <>
                <CardTitle>Winning Proposal</CardTitle>
                <span>{poll.winningProposal}</span>
              </>
            )}
          </DetailsPanelCard>
        </RightPanels>
      </ContentWrapper>
    </RiseUp>
  );
}

const reduxProps = (state, { match }) => {
  const { tally, accounts, metamask, polls } = state;
  const { pollSlug } = match.params;

  const poll = polls.find(({ voteId }) => {
    return toSlug(voteId) === pollSlug;
  });
  const isValidRoute = poll && pollSlug;

  return {
    poll,
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
