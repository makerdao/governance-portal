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
import Transaction from './shared/Transaction';
import { sendMkrToProxy, clear as clearProxyState } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';

class Lock extends Component {
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
      txHash,
      confirming,
      network,
      sendMkrToProxy,
      modalClose
    } = this.props;
    if (txHash)
      return (
        <Transaction
          lastCard
          {...{ txHash, confirming, network }}
          nextStep={() => modalClose()}
        />
      );

    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Lock MKR</StyledTitle>
        </StyledTop>
        <StyledBlurb>
          Please select the amount of MKR to lock in the secure voting contract.
          You can withdraw it at any time.
        </StyledBlurb>
        <InputLabels>
          <div>Enter MKR amount</div>
          <div>
            <ValueLabel>MKR balance</ValueLabel> {balance} MKR
          </div>
        </InputLabels>
        <StyledInput type="text" onChange={this.setAmount} />
        <EndButton onClick={() => sendMkrToProxy(this.state.amount)}>
          Lock MKR
        </EndButton>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  balance: getActiveAccount(state).mkrBalance,
  txHash: state.proxy.sendMkrTxHash,
  confirming: state.proxy.confirmingSendMkr,
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { sendMkrToProxy, modalClose, clearProxyState }
)(Lock);
