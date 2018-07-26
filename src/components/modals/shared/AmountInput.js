import React, { Component, Fragment } from 'react';
import {
  StyledTop,
  StyledTitle,
  StyledBlurb,
  InputLabels,
  ValueLabel,
  EndButton,
  GreyLink
} from './styles';
import Input from '../../Input';
import Transaction from './Transaction';

export default class AmountInput extends Component {
  constructor(props) {
    super(props);
    this.state = { amount: '' };
  }

  componentDidMount() {
    if (this.props.reset !== false) this.props.clearProxyState();
  }

  setAmount = event => {
    this.setState({ amount: event.target.value });
  };

  setMaxAmount = () => {
    this.setState({ amount: this.props.balance });
  };

  render() {
    const {
      txHash,
      confirming,
      network,
      modalClose,
      title,
      blurb,
      amountLabel,
      action,
      account,
      balance,
      buttonLabel
    } = this.props;
    if (txHash)
      return (
        <Transaction
          lastCard
          {...{ txHash, confirming, network, account }}
          nextStep={() => modalClose()}
        />
      );

    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>{title}</StyledTitle>
        </StyledTop>
        <StyledBlurb>{blurb}</StyledBlurb>
        <InputLabels>
          <div>Enter MKR amount</div>
          <div>
            <ValueLabel>{amountLabel}</ValueLabel> {balance} MKR
          </div>
        </InputLabels>
        <Input
          type="text"
          value={this.state.amount}
          onChange={this.setAmount}
          button={<GreyLink onClick={this.setMaxAmount}>Set max</GreyLink>}
        />
        <EndButton onClick={() => action(this.state.amount)}>
          {buttonLabel}
        </EndButton>
      </Fragment>
    );
  }
}
