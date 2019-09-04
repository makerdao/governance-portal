import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';

import { add, subtract, formatRound } from '../../../utils/misc';
import Button from '../../Button';
import { getActiveAccount } from '../../../reducers/accounts';
import { voteForPoll, withdrawVoteForPoll } from '../../../reducers/polling';
import { modalClose } from '../../../reducers/modal';
import { clear as voteClear } from '../../../reducers/vote';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  MkrAmt,
  VoteImpact,
  VoteImpactHeading
} from '../shared/styles';
import TransactionModal from '../shared/InitiateTransaction';

const headingColor = '#212536';
const borderColor = '#DFE1E3';

class PollingVote extends Component {
  componentDidMount() {
    this.props.voteClear();
    ReactGA.modalview('pollingVote');
  }

  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs
  render() {
    const {
      poll,
      voteTxHash,
      voteTxStatus,
      activeAccount,
      modalClose
    } = this.props;
    const {
      pollId,
      alreadyVotingFor,
      selectedOption,
      selectedOptionId,
      totalVotes
    } = poll;
    const { linkedAccount } = activeAccount.proxy;
    const pollVotingPower = add(
      activeAccount.proxy.votingPower,
      add(
        activeAccount.mkrBalance,
        add(
          linkedAccount.mkrBalance,
          add(activeAccount.mkrLockedChiefHot, activeAccount.mkrLockedChiefCold)
        )
      )
    );
    return (
      <TransactionModal
        txHash={voteTxHash}
        txStatus={voteTxStatus}
        account={activeAccount}
        txPurpose={
          alreadyVotingFor
            ? 'This transaction is to withdraw your vote'
            : 'This transaction is to cast your vote'
        }
        onComplete={modalClose}
      >
        {onNext => {
          if (alreadyVotingFor) {
            return (
              <Fragment>
                <StyledTop>
                  <StyledTitle>Confirmation</StyledTitle>
                </StyledTop>
                <StyledBlurb>
                  You will be withdrawing your vote from{' '}
                  <strong style={{ color: headingColor }}>
                    {selectedOption}
                  </strong>{' '}
                  please confirm below.
                </StyledBlurb>
                <VoteImpact>
                  <div
                    style={{
                      width: '100%',
                      padding: '8px 30px'
                    }}
                  >
                    <VoteImpactHeading>Current vote</VoteImpactHeading>
                    <MkrAmt>{formatRound(totalVotes, 3)}</MkrAmt>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      padding: '8px 30px',
                      borderLeft: `1px solid ${borderColor}`
                    }}
                  >
                    <VoteImpactHeading>After vote withdrawal</VoteImpactHeading>
                    <MkrAmt>
                      {formatRound(
                        Number(subtract(totalVotes, pollVotingPower)) < 0
                          ? 0
                          : subtract(totalVotes, pollVotingPower),
                        3
                      )}
                    </MkrAmt>
                  </div>
                </VoteImpact>

                <div
                  style={{
                    marginLeft: 'auto',
                    marginTop: '18px'
                  }}
                >
                  <Button
                    slim
                    onClick={() => {
                      mixpanel.track('btn-click', {
                        id: 'confirm-withdraw-vote',
                        product: 'governance-dashboard',
                        section: 'polling-vote-modal'
                      });
                      this.props.withdrawVoteForPoll(pollId);
                      onNext();
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </Fragment>
            );
          } else {
            return (
              <Fragment>
                <StyledTop>
                  <StyledTitle>Confirmation</StyledTitle>
                </StyledTop>
                <StyledBlurb>
                  You will be voting for{' '}
                  <strong style={{ color: headingColor }}>
                    {selectedOption}
                  </strong>{' '}
                  please confirm vote below. Vote can be withdrawn at anytime
                </StyledBlurb>
                <VoteImpact>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '180px',
                      padding: '8px 18px'
                    }}
                  >
                    <VoteImpactHeading>Total voting weight</VoteImpactHeading>
                    <MkrAmt>{formatRound(pollVotingPower, 3)}</MkrAmt>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      padding: '8px 30px',
                      maxWidth: '180px',
                      borderLeft: `1px solid ${borderColor}`
                    }}
                  >
                    <VoteImpactHeading>Current vote</VoteImpactHeading>
                    <MkrAmt>{formatRound(totalVotes, 3)}</MkrAmt>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      padding: '8px 30px',
                      maxWidth: '180px',
                      borderLeft: `1px solid ${borderColor}`
                    }}
                  >
                    <VoteImpactHeading>After vote cast</VoteImpactHeading>
                    <MkrAmt>
                      {formatRound(add(totalVotes, pollVotingPower), 3)}
                    </MkrAmt>
                  </div>
                </VoteImpact>
                <div
                  style={{
                    marginLeft: 'auto',
                    marginTop: '18px'
                  }}
                >
                  <Button
                    slim
                    onClick={() => {
                      mixpanel.track('btn-click', {
                        id: 'confirm-vote',
                        product: 'governance-dashboard',
                        section: 'polling-vote-modal'
                      });
                      this.props.voteForPoll(pollId, selectedOptionId);
                      onNext();
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </Fragment>
            );
          }
        }}
      </TransactionModal>
    );
  }
}

PollingVote.propTypes = {
  voteTxHash: PropTypes.string,
  voteTxStatus: PropTypes.string,
  poll: PropTypes.object
};

PollingVote.defaultProps = {
  voteTxHash: '',
  voteTxStatus: '',
  poll: {}
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state),
    voteTxHash: state.polling.voteTxHash,
    voteTxStatus: state.polling.voteTxStatus
  }),
  { modalClose, voteClear, voteForPoll, withdrawVoteForPoll }
)(PollingVote);
