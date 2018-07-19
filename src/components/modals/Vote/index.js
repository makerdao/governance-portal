import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '../../Button';

import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import Transaction from '../shared/Transaction';

class Vote extends Component {
  state = {
    step: 1
  };

  componentDidUpdate(prevProps) {
    if (this.props.voteTxHash !== prevProps.voteTxHash) this.nextStep();
  }

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, reject transaction, why did this tx fail
  render() {
    let proposal;
    switch (this.state.step) {
      case 1:
        proposal = this.props.modalProps.proposal;
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
            <StyledBlurb>
              Your voting power: {this.props.activeAccount.proxy.balance} MKR
            </StyledBlurb>
            <div
              style={{
                margin: 'auto',
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
      case 2:
        return (
          <Transaction
            txHash={this.props.voteTxHash}
            nextStep={this.props.modalClose}
            network={this.props.network}
            lastCard={true}
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

export default Vote;
