import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';

import { add, eq, subtract, formatRound } from '../../../utils/misc';
import Button from '../../Button';
import WithTally from '../../hocs/WithTally';
import { getActiveAccount } from '../../../reducers/accounts/actions';
import { modalClose } from '../../../reducers/modal';
import {
  sendVote,
  withdrawVote,
  clear as voteClear
} from '../../../reducers/vote';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  MkrAmt,
  VoteImpact,
  VoteImpactHeading
} from '../shared/styles';
import Transaction from '../shared/Transaction';

class Vote extends Component {
  componentDidMount() {
    this.props.voteClear();
    ReactGA.modalview('vote');
  }

  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs
  render() {
    const { proposal } = this.props;
    const { proxy, votingFor } = this.props.activeAccount;
    const alreadyVotingFor = eq(votingFor, proposal.address);
    switch (this.props.voteProgress) {
      case 'confirm':
      default:
        if (alreadyVotingFor) {
          return (
            <Fragment>
              <StyledTop>
                <StyledTitle>Confirmation</StyledTitle>
              </StyledTop>
              <StyledBlurb>
                You will be withdrawing your vote from{' '}
                <strong style={{ color: '#212536' }}>{proposal.title}</strong>{' '}
                please confirm below.
              </StyledBlurb>
              <WithTally candidate={proposal.address}>
                {({ approvals }) => (
                  <VoteImpact>
                    <div
                      style={{
                        width: '100%',
                        padding: '8px 30px'
                      }}
                    >
                      <VoteImpactHeading>Current vote</VoteImpactHeading>
                      <MkrAmt>{formatRound(approvals, 3)}</MkrAmt>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        padding: '8px 30px',
                        borderLeft: '1px solid #DFE1E3'
                      }}
                    >
                      <VoteImpactHeading>
                        After vote withdrawal
                      </VoteImpactHeading>
                      <MkrAmt>
                        {formatRound(
                          Number(subtract(approvals, proxy.votingPower)) < 0
                            ? 0
                            : subtract(approvals, proxy.votingPower),
                          3
                        )}
                      </MkrAmt>
                    </div>
                  </VoteImpact>
                )}
              </WithTally>
              <div
                style={{
                  marginLeft: 'auto',
                  marginTop: '18px'
                }}
              >
                <Button slim onClick={() => this.props.withdrawVote()}>
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
                <strong style={{ color: '#212536' }}>{proposal.title}</strong>{' '}
                please confirm vote below. Vote can be withdrawn at anytime
              </StyledBlurb>
              <WithTally candidate={proposal.address}>
                {({ approvals }) => (
                  <VoteImpact>
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '180px',
                        padding: '8px 18px'
                      }}
                    >
                      <VoteImpactHeading>In secure contract</VoteImpactHeading>
                      <MkrAmt>{formatRound(proxy.votingPower, 3)}</MkrAmt>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        padding: '8px 30px',
                        maxWidth: '180px',
                        borderLeft: '1px solid #DFE1E3'
                      }}
                    >
                      <VoteImpactHeading>Current vote</VoteImpactHeading>
                      <MkrAmt>{formatRound(approvals, 3)}</MkrAmt>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        padding: '8px 30px',
                        maxWidth: '180px',
                        borderLeft: '1px solid #DFE1E3'
                      }}
                    >
                      <VoteImpactHeading>After vote cast</VoteImpactHeading>
                      <MkrAmt>
                        {formatRound(add(approvals, proxy.votingPower), 3)}
                      </MkrAmt>
                    </div>
                  </VoteImpact>
                )}
              </WithTally>
              <div
                style={{
                  marginLeft: 'auto',
                  marginTop: '18px'
                }}
              >
                <Button
                  slim
                  onClick={() => this.props.sendVote(proposal.address)}
                >
                  Confirm
                </Button>
              </div>
            </Fragment>
          );
        }
      case 'signTx':
        return (
          <Transaction
            txPurpose={
              alreadyVotingFor
                ? 'This transaction is to withdraw your vote'
                : 'This transaction is to cast your vote'
            }
            txHash={this.props.voteTxHash}
            nextStep={() => this.props.modalClose()}
            network={this.props.network}
            lastCard={true}
            account={this.props.activeAccount}
            confirming={this.props.confirming}
          />
        );
    }
  }
}

Vote.propTypes = {
  voteTxHash: PropTypes.string,
  sendVote: PropTypes.func,
  proposal: PropTypes.object
};

Vote.defaultProps = {
  voteTxHash: '',
  proposal: {}
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state),
    voteTxHash: state.vote.txHash,
    confirming: state.vote.confirming,
    voteProgress: state.vote.voteProgress,
    network: state.metamask.network === 'kovan' ? 'kovan' : 'mainnet'
  }),
  { modalClose, sendVote, voteClear, withdrawVote }
)(Vote);
