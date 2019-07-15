import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';
import { toSlug } from '../utils/misc';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import NotFound from './NotFound';
import { VotingWeightBanner } from './PollingList';
import {
  activeCanVote,
  getActiveVotingFor,
  getPollOptionVotingFor
} from '../reducers/accounts';
import { modalOpen } from '../reducers/modal';
import { getWinningProp } from '../reducers/proposals';
import { voteForPoll, withdrawVoteForPoll } from '../reducers/polls';
import theme, { colors } from '../theme';
import { cutMiddle, eq } from '../utils/misc';
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
  flex-direction: row;
  justify-content: space-between;
`;

const DetailsPanelCard = styled(Card)`
  margin-bottom: 29px;
  font-size: ${({ theme }) => theme.fonts.size.medium};
  padding: 14px 20px;
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
  width: 125px;
  margin-left: 13px;
  margin-right: 13px;
  color: ${({ color }) => (color ? `rgb(${colors[color]})` : 'black')};
`;

const VoteButton = styled(Button)`
  border: 0px;
  padding: 0px;
`;

const DescriptionCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0;
  max-width: 750px;
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

const DownloadButton = styled(Button)`
  display: flex;
`;

const DetailsCardItem = ({ name, value, component }) => (
  <DetailsItem>
    <DetailsCardText>{name}</DetailsCardText>
    {value ? value : component}
  </DetailsItem>
);

const VotedFor = ({
  voteStateFetching,
  votedPollOption,
  active,
  withdrawVote
}) => {
  if (voteStateFetching) {
    return <Loader mt={34} mb={34} color="header" background="background" />;
  }
  if (votedPollOption)
    return (
      <VoteStatusText>
        <Black>{active ? 'Currently voting: ' : 'Voted for: '}</Black>
        <Strong>{votedPollOption} </Strong>
        {active && (
          <Fragment>
            <Black>| </Black>
            <Blue onClick={() => withdrawVote()}>Withdraw Vote</Blue>
          </Fragment>
        )}
      </VoteStatusText>
    );
  else
    return (
      <VoteStatusText>
        <Black>{active ? 'Not currently voting' : 'You did not vote'}</Black>
      </VoteStatusText>
    );
};

class VotingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'Please choose...'
    };
  }

  onDropdownSelect = (value, index) => {
    const selectedOptionId = parseInt(index) + 1;
    this.setState({
      selectedOption: value,
      selectedOptionId
    });
  };

  formatOptions = options => {
    const displayOptions = [...options];
    // Index 0 is expected to always be '0: abstain' but we don't want to display it here.
    displayOptions.shift();
    return displayOptions;
  };

  render() {
    const { poll, voteForPoll } = this.props;
    const { pollId, options } = poll;

    const { selectedOption, selectedOptionId } = this.state;
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
            emptyMsg="Not available"
          />
          <VoteButton
            bgColor="green"
            color="white"
            hoverColor="white"
            width="135px"
            disabled={!poll.active}
            onClick={() => voteForPoll(pollId, selectedOptionId)}
          >
            Vote Now
          </VoteButton>
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

const downloadRawPollData = (multiHash, rawData) => {
  const element = document.createElement('a');
  const file = new Blob([rawData], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${multiHash}.txt`;
  document.body.appendChild(element);
  element.click();
};

class Polling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votedPollOption: null,
      activeAccount: this.props.activeAccount,
      voteStateFetching: true
    };
  }

  async componentDidMount() {
    if (this.state.activeAccount) await this.getVotedPollOption();
  }

  static getDerivedStateFromProps(newProps, state) {
    /* Replaces componentWillReceiveProps
    https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change */

    if (newProps.activeAccount !== state.activeAccount) {
      return { activeAccount: newProps.activeAccount };
    } else return null;
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.activeAccount !== prevProps.activeAccount) {
      await this.getVotedPollOption();
    }
  }

  getVotedPollOption = async () => {
    const optionId = await getPollOptionVotingFor(
      this.props.poll.pollId,
      this.state.activeAccount
    );
    const votedPollOption = this.props.poll.options[optionId];
    this.setState({
      votedPollOption,
      voteStateFetching: false
    });
  };

  voteForPoll = (pollId, selectedOptionId) => {
    this.props.voteForPoll(pollId, selectedOptionId);
  };

  withdrawVote = () => {
    this.props.withdrawVoteForPoll(this.props.poll.pollId);
  };

  render() {
    const { votedPollOption, activeAccount, voteStateFetching } = this.state;
    const { poll, isValidRoute, network, accountDataFetching } = this.props;
    if (!poll) return null;
    const {
      discussion_link,
      rawData,
      multiHash,
      active,
      options,
      optionVotingFor
    } = poll;
    if (isNil(poll) || isEmpty(poll) || !isValidRoute) return <NotFound />;

    return (
      <RiseUp>
        <VotingWeightBanner
          fetching={accountDataFetching}
          activeAccount={activeAccount}
        />
        <ContentWrapper>
          <DescriptionCard>
            <ReactMarkdown
              className="markdown"
              skipHtml={true}
              source={poll.content}
            />
            {rawData && (
              <DownloadButton
                onClick={() => downloadRawPollData(multiHash, rawData)}
              >
                Download raw metadata
              </DownloadButton>
            )}
          </DescriptionCard>
          <RightPanels>
            {poll.active && (
              <VotingPanel poll={poll} voteForPoll={this.voteForPoll} />
            )}
            <VotedFor
              votedPollOption={options[optionVotingFor] || votedPollOption}
              voteStateFetching={voteStateFetching}
              active={active}
              withdrawVote={this.withdrawVote}
            />
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
                    <ExternalLink
                      href="https://makerdao.com/en/"
                      target="_blank"
                    >
                      Governance FAQ's
                    </ExternalLink>
                  )
                },
                {
                  name: 'Discussion',
                  component: (
                    <ExternalLink href={discussion_link} target="_blank">
                      Here
                    </ExternalLink>
                  ),
                  hide: !discussion_link
                }
              ].map((item, i) => {
                if (!item.hide) return <DetailsCardItem key={i} {...item} />;
                return null;
              })}

              <CardTitle>Voting Stats</CardTitle>
              {[
                { name: 'Total votes', value: `${poll.totalVotes} MKR` },
                {
                  name: 'Participation',
                  value: isNaN(poll.participation)
                    ? ''
                    : `${poll.participation}%`
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
}

const reduxProps = (state, { match }) => {
  const { accounts, metamask, polls } = state;
  const { pollSlug } = match.params;

  const poll = polls.find(({ pollId }) => {
    return toSlug(pollId) === pollSlug;
  });
  const isValidRoute = poll && pollSlug;
  const activeAccount = accounts.activeAccount
    ? accounts.allAccounts.find(a => eq(a.address, accounts.activeAccount))
    : null;

  if (poll && poll.legacyPoll) {
    const winningProp = getWinningProp(state, poll.pollId);
    poll.winningProposal = winningProp ? winningProp.title : 'Not applicable';
  }

  return {
    poll,
    activeAccount,
    accountDataFetching: accounts.fetching,
    canVote: activeCanVote({ accounts }),
    votingFor: getActiveVotingFor({ accounts }),
    network: metamask.network,
    isValidRoute
  };
};

export default connect(
  reduxProps,
  { modalOpen, voteForPoll, withdrawVoteForPoll }
)(Polling);
