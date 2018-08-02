import React, { Component, Fragment } from 'react';
import {
  StyledTop,
  StyledTitle,
  StyledBlurb,
  InputLabels,
  ValueLabel,
  EndButton,
  GreyLink,
  Skip,
  FlexRowEnd
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

  handleKeyPress = event => {
    if (event.key === 'Enter') this.submit(this.state.amount);
  };

  submit(amount) {
    const { action, balance } = this.props;
    if (Number(amount) === 0 || Number(amount) > balance) {
      window.alert('Enter a valid amount.');
    } else {
      action(amount);
    }
  }

  render() {
    const {
      txHash,
      txSent,
      confirming,
      network,
      modalClose,
      title,
      blurb,
      amountLabel,
      account,
      balance,
      buttonLabel,
      skip
    } = this.props;
    if (txSent)
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
          onKeyPress={this.handleKeyPress}
          value={this.state.amount}
          onChange={this.setAmount}
          button={<GreyLink onClick={this.setMaxAmount}>Set max</GreyLink>}
        />
        <FlexRowEnd>
          <Skip mr={24} mt={24} onClick={() => skip()}>
            Skip this step
          </Skip>
          <EndButton onClick={() => this.submit(this.state.amount)}>
            {buttonLabel}
          </EndButton>
        </FlexRowEnd>
      </Fragment>
    );
  }
}
