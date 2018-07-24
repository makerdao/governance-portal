import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { getActiveAccount } from '../../reducers/accounts';
import {
  StyledTop,
  StyledTitle,
  StyledBlurb,
  StyledInput,
  InputLabels,
  ValueLabel,
  EndButton
} from './shared/styles';
import { withdrawMkr, clear as clearProxyState } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import Transaction from './shared/Transaction';

class Withdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.clearProxyState();
  }

  setAmount = event => {
    this.setState({ amount: event.target.value });
  };

  render() {
    const {
      balance,
      withdrawMkr,
      txHash,
      confirming,
      network,
      modalClose
    } = this.props;

    if (txHash)
      return (
        <Transaction
          {...{ txHash, confirming, network }}
          lastCard
          nextStep={() => modalClose()}
        />
      );

    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Withdraw MKR</StyledTitle>
        </StyledTop>
        <StyledBlurb>
          Please select the amount of MKR to withdraw from the secure voting
          contract.
        </StyledBlurb>
        <InputLabels>
          <div>Enter MKR amount</div>
          <div>
            <ValueLabel>MKR in voting system</ValueLabel> {balance} MKR
          </div>
        </InputLabels>
        <StyledInput type="text" onChange={this.setAmount} />
        <EndButton onClick={() => withdrawMkr(this.state.amount)}>
          Withdraw MKR
        </EndButton>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  balance: getActiveAccount(state).proxy.votingPower,
  txHash: state.proxy.withdrawMkrTxHash,
  confirming: state.proxy.confirmingWithdrawMkr,
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { withdrawMkr, modalClose, clearProxyState }
)(Withdraw);
