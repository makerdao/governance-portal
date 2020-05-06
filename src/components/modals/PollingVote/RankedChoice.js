import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';

import { add, subtract, formatRound } from '../../../utils/misc';
import Button from '../../Button';
import { getActiveAccount } from '../../../reducers/accounts';
import { voteForRankedChoicePoll } from '../../../reducers/polling';
import { modalClose } from '../../../reducers/modal';
import { clear as voteClear } from '../../../reducers/vote';
import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import TransactionModal from '../shared/InitiateTransaction';

class PollingVote extends Component {
  componentDidMount() {
    this.props.voteClear();
    ReactGA.modalview('pollingVoteRankedChoice');
  }

  render() {
    const {
      poll,
      voteTxHash,
      voteTxStatus,
      activeAccount,
      modalClose
    } = this.props;
    const { pollId, rankings } = poll;

    return (
      <TransactionModal
        txHash={voteTxHash}
        txStatus={voteTxStatus}
        account={activeAccount}
        txPurpose={'This transaction is to cast your vote'}
        onComplete={modalClose}
      >
        {onNext => {
          return (
            <Fragment>
              <StyledTop>
                <StyledTitle>Confirmation</StyledTitle>
              </StyledTop>
              <StyledBlurb>
                Please confirm your vote below. Votes can be withdrawn at
                anytime.
              </StyledBlurb>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
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
                    this.props.voteForRankedChoicePoll(pollId, rankings);
                    onNext();
                  }}
                >
                  Confirm
                </Button>
              </div>
            </Fragment>
          );
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
  { modalClose, voteClear, voteForRankedChoicePoll }
)(PollingVote);
