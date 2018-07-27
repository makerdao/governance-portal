import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import round from 'lodash.round';

import { add } from '../../../utils/misc';
import Button from '../../Button';
import WithTally from '../../hocs/WithTally';
import { getActiveAccount } from '../../../reducers/accounts';
import { modalClose } from '../../../reducers/modal';
import { sendVote } from '../../../reducers/vote';
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
  state = {
    step: 1
  };

  componentDidUpdate(prevProps) {
    if (this.props.voteTxHash !== prevProps.voteTxHash) this.nextStep();
  }

  componentWillUnmount() {
    this.setState({ step: 1 });
  }

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, reject transaction, why did this tx fail
  render() {
    const { proposal } = this.props.modalProps;
    const { proxy, votingFor } = this.props.activeAccount;
    const alreadyVotingFor =
      votingFor.toLowerCase() === proposal.address.toLowerCase();
    switch (this.state.step) {
      case 1:
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
            {alreadyVotingFor ? (
              <StyledBlurb>
                You're already voting for this proposal!
              </StyledBlurb>
            ) : (
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
                      <MkrAmt>{round(proxy.votingPower, 4)}</MkrAmt>
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
                      <MkrAmt>{round(approvals, 4)}</MkrAmt>
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
                        {round(add(approvals, proxy.votingPower), 4)}{' '}
                      </MkrAmt>
                    </div>
                  </VoteImpact>
                )}
              </WithTally>
            )}
            <div
              style={{
                marginLeft: 'auto',
                marginTop: '18px'
              }}
            >
              <Button
                slim
                disabled={alreadyVotingFor}
                onClick={() => this.props.sendVote(proposal.address)}
              >
                Confirm
              </Button>
            </div>
          </Fragment>
        );
      case 2:
        return (
          <Transaction
            txHash={this.props.voteTxHash}
            nextStep={() => window.location.reload()}
            network={this.props.network}
            lastCard={true}
            account={this.props.activeAccount}
            confirming={this.props.confirming}
          />
        );
      default:
        return null;
    }
  }
}

Vote.propTypes = {
  voteTxHash: PropTypes.string,
  sendVote: PropTypes.func,
  modalProps: PropTypes.object
};

Vote.defaultProps = {
  voteTxHash: ''
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state),
    voteTxHash: state.vote.txHash,
    confirming: state.vote.confirming,
    network: state.metamask.network === 'kovan' ? 'kovan' : 'mainnet'
  }),
  { modalClose, sendVote }
)(Vote);
