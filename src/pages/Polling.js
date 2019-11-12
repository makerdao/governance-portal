import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { isNil, isEmpty } from 'ramda';
import mixpanel from 'mixpanel-browser';
import { toSlug, formatRound, cutMiddle, eq } from '../utils/misc';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import PollingVote from '../components/modals/PollingVote';
import NotFound from './NotFound';
import { VotingWeightBanner } from './PollingList';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import { modalOpen } from '../reducers/modal';
import { getWinningProp } from '../reducers/proposals';
import { getOptionVotingFor, pollDataInit } from '../reducers/polling';
import theme, { colors } from '../theme';
import { ethScanLink } from '../utils/ethereum';
import { MIN_MKR_PERCENTAGE } from '../utils/constants';
import ExternalLink from '../components/Onboarding/shared/ExternalLink';
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
  text-overflow: ellipsis;
  overflow: hidden;
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
  margin: 0;
  max-width: 750px;
  padding: 0px 25px 93px 25px;
  color: #546978;
  line-height: 30px;
`;

const DownloadButton = styled(Button)`
  position: absolute;
  bottom: 20px;
`;

const DetailsCardItem = ({ name, value, component }) => (
  <DetailsItem>
    <DetailsCardText>{name}</DetailsCardText>
    {value ? value : component}
  </DetailsItem>
);

const getTotalVotesForOption = (voteBreakdown, selectedOptionId) => {
  return voteBreakdown[selectedOptionId].mkrSupport;
};

const VotedFor = ({
  voteStateFetching,
  optionVotingFor,
  optionVotingForId,
  modalOpen,
  poll
}) => {
  if (voteStateFetching) {
    return <Loader mt={34} mb={34} color="header" background="background" />;
  }
  const { voteBreakdown, active, pollId } = poll;
  const totalVotes =
    voteBreakdown && (optionVotingForId || optionVotingForId === 0)
      ? getTotalVotesForOption(voteBreakdown, optionVotingForId)
      : null;
  if (optionVotingFor)
    return (
      <VoteStatusText>
        <Black>{active ? 'Currently voting: ' : 'Voted for: '}</Black>
        <Strong>{optionVotingFor} </Strong>
        {active && (
          <Fragment>
            <Black>| </Black>
            <Blue
              onClick={() => {
                mixpanel.track('btn-click', {
                  id: 'withdraw',
                  product: 'governance-dashboard',
                  page: 'Polling',
                  section: 'voting-panel'
                });
                modalOpen(PollingVote, {
                  poll: {
                    pollId,
                    alreadyVotingFor: true,
                    totalVotes,
                    selectedOption: optionVotingFor
                  }
                });
              }}
            >
              Withdraw Vote
            </Blue>
          </Fragment>
        )}
      </VoteStatusText>
    );
  else if (!poll.legacyPoll)
    return (
      <VoteStatusText style={{ display: 'flex' }}>
        <Black style={{ margin: 'auto', fontStyle: 'oblique' }}>
          {active ? 'Not currently voting' : 'You did not vote'}
        </Black>
      </VoteStatusText>
    );
  else return null;
};

class VotingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null
    };
  }

  onDropdownSelect = (value, index) => {
    const selectedOptionId = parseInt(index);
    this.setState({
      selectedOption: value,
      selectedOptionId
    });
    mixpanel.track('input-change', {
      id: 'dropdown-select',
      product: 'governance-dashboard',
      page: 'Polling',
      section: 'voting-panel'
    });
  };

  render() {
    const { poll, activeAccount, optionVotingFor, modalOpen } = this.props;
    const { pollId, options, voteBreakdown } = poll;
    const { selectedOption, selectedOptionId } = this.state;
    const totalVotes =
      voteBreakdown && (selectedOptionId || selectedOptionId === 0)
        ? getTotalVotesForOption(voteBreakdown, selectedOptionId)
        : null;

    return (
      <React.Fragment>
        <VoteSelection>
          <Dropdown
            color="green"
            items={options}
            renderItem={item => (
              <DropdownText color="green">{item}</DropdownText>
            )}
            renderRowItem={item => <DropdownText>{item}</DropdownText>}
            value={selectedOption || optionVotingFor || 'Please choose...'}
            onSelect={this.onDropdownSelect}
            emptyMsg="Not available"
          />
          <VoteButton
            bgColor="green"
            color="white"
            hoverColor="white"
            width="135px"
            disabled={
              !poll.active ||
              !activeAccount ||
              selectedOptionId === undefined ||
              selectedOption === optionVotingFor
            }
            onClick={() => {
              mixpanel.track('btn-click', {
                id: 'vote',
                product: 'governance-dashboard',
                page: 'Polling',
                section: 'voting-panel'
              });
              modalOpen(PollingVote, {
                poll: {
                  pollId,
                  selectedOption,
                  selectedOptionId,
                  totalVotes
                }
              });
            }}
          >
            Vote Now
          </VoteButton>
        </VoteSelection>
      </React.Fragment>
    );
  }
}

const timeLeft = (startDate, endDate, active) => {
  const now = new Date();
  let timeLeft = Math.floor(endDate / 1000) - Math.floor(now / 1000);
  const days = Math.floor(timeLeft / (3600 * 24));
  const Sday = days !== 1 ? 's' : '';
  timeLeft -= days * 3600 * 24;
  const hours = Math.floor(timeLeft / 3600);
  const Shour = hours !== 1 ? 's' : '';
  timeLeft -= hours * 3600;
  const minutes = Math.floor(timeLeft / 60);
  const Sminute = minutes !== 1 ? 's' : '';

  return active
    ? `${days} day${Sday} ${hours} hr${Shour} ${minutes} min${Sminute}`
    : endDate.toLocaleDateString('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
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
      activeAccount: this.props.activeAccount,
      voteStateFetching: true
    };
  }

  static getDerivedStateFromProps(newProps, state) {
    /* Replaces componentWillReceiveProps
    https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#fetching-external-data-when-props-change */

    if (newProps.activeAccount !== state.activeAccount) {
      return { activeAccount: newProps.activeAccount };
    } else return null;
  }

  async componentDidUpdate(prevProps) {
    if (
      this.state.activeAccount !== prevProps.activeAccount ||
      (this.props.poll && prevProps.poll === undefined)
    ) {
      this.props.pollDataInit(this.props.poll);
      this.updateVotedPollOption();
    }
  }

  componentDidMount() {
    if (!!this.props.poll) this.props.pollDataInit(this.props.poll);
    this.updateVotedPollOption();
  }

  updateVotedPollOption = async () => {
    if (!this.props.poll || !this.state.activeAccount) return null;
    await this.props.getOptionVotingFor(
      this.state.activeAccount.address,
      this.props.poll.pollId
    );
    this.setState({
      voteStateFetching: false
    });
  };

  validateLink = link => {
    if (!link) return null;
    return link.indexOf('http') === 0 ? link : `https://${link}`;
  };

  render() {
    const { activeAccount, voteStateFetching } = this.state;
    const {
      poll,
      isValidRoute,
      network,
      accountDataFetching,
      modalOpen,
      pollsFetching
    } = this.props;
    if (pollsFetching && !poll)
      return <Loader mt={34} mb={34} color="header" background="background" />;
    if (isNil(poll) || isEmpty(poll) || !isValidRoute) return <NotFound />;
    const {
      discussion_link,
      rawData,
      multiHash,
      active,
      options,
      optionVotingFor,
      totalVotes
    } = poll;
    const optionVotingForName = options[optionVotingFor];

    const winningProposalName = poll.legacyPoll
      ? poll.winningProposal
      : poll.options[poll.winningProposal];

    const numUniqueVoters = poll.numUniqueVoters
      ? poll.numUniqueVoters.toString()
      : '0';

    const timeLeftString = active ? 'Ends In' : 'Ended On';

    return (
      <Fragment>
        <VotingWeightBanner
          fetching={accountDataFetching}
          activeAccount={activeAccount}
        />
        <RiseUp>
          <ContentWrapper>
            <DescriptionCard>
              <ReactMarkdown
                className="markdown"
                skipHtml={false}
                source={poll.content}
              />
              {rawData && (
                <DownloadButton
                  onClick={() => downloadRawPollData(multiHash, rawData)}
                >
                  Download raw document
                </DownloadButton>
              )}
            </DescriptionCard>
            <RightPanels>
              {active && (
                <VotingPanel
                  optionVotingFor={optionVotingForName}
                  poll={poll}
                  activeAccount={activeAccount}
                  modalOpen={modalOpen}
                  totalVotes={totalVotes}
                />
              )}
              <VotedFor
                poll={poll}
                optionVotingFor={optionVotingForName}
                optionVotingForId={optionVotingFor}
                voteStateFetching={voteStateFetching || accountDataFetching}
                withdrawVote={this.withdrawVote}
                modalOpen={modalOpen}
                totalVotes={totalVotes}
                alreadyVotingFor={true}
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
                  {
                    name: 'Started',
                    value: poll.startDate.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })
                  },
                  {
                    name: timeLeftString,
                    value: timeLeft(poll.startDate, poll.endDate, active)
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
                      <ExternalLink
                        href={this.validateLink(discussion_link)}
                        target="_blank"
                      >
                        Here
                      </ExternalLink>
                    ),
                    hide: !discussion_link
                  }
                ].map((item, i) => {
                  if (!item.hide) return <DetailsCardItem key={i} {...item} />;
                  return null;
                })}

                {poll.legacyPoll ? null : (
                  <>
                    <CardTitle>Voting Stats</CardTitle>
                    {[
                      {
                        name: 'Total votes',
                        value: isNaN(poll.totalVotes)
                          ? '----'
                          : `${formatRound(poll.totalVotes, 2)} MKR`
                      },
                      {
                        name: 'Participation',
                        value: isNaN(poll.participation)
                          ? '----'
                          : parseFloat(poll.participation) <
                              MIN_MKR_PERCENTAGE &&
                            parseFloat(poll.participation) !== 0
                          ? `< ${MIN_MKR_PERCENTAGE}%`
                          : `${formatRound(poll.participation, 2)}%`
                      },
                      {
                        name: 'Unique voters',
                        value: numUniqueVoters
                      }
                    ].map((item, i) => (
                      <DetailsCardItem key={i} {...item} />
                    ))}
                  </>
                )}

                <VoteBreakdown poll={poll} />
                {winningProposalName && (
                  <>
                    <CardTitle>Winning Proposal</CardTitle>
                    <span>{winningProposalName}</span>
                  </>
                )}
              </DetailsPanelCard>
            </RightPanels>
          </ContentWrapper>
        </RiseUp>
      </Fragment>
    );
  }
}

function VoteBreakdown({ poll }) {
  const { voteBreakdownFetching, voteBreakdown, options, legacyPoll } = poll;
  if (legacyPoll) return null;
  const voteBreakdownExists = voteBreakdown && voteBreakdown.length > 0;
  return (
    <>
      <CardTitle>Vote breakdown</CardTitle>
      {voteBreakdownFetching ? (
        <Loader mt={34} mb={34} color="header" background="white" />
      ) : voteBreakdownExists ? (
        <>
          {voteBreakdown.map((item, i) => (
            <DetailsCardItem key={i} {...item} />
          ))}
        </>
      ) : (
        <>
          {options.map((_, i) => (
            <DetailsCardItem key={i} {...{ name: options[i], value: '----' }} />
          ))}
        </>
      )}
    </>
  );
}

const reduxProps = (state, { match }) => {
  const { accounts, metamask, polling } = state;
  const { polls, pollsFetching } = polling;
  const { pollSlug } = match.params;

  const poll = polls.find(({ voteId }) => {
    return toSlug(voteId) === pollSlug;
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
    pollsFetching,
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
  {
    modalOpen,
    getOptionVotingFor,
    pollDataInit
  }
)(Polling);
