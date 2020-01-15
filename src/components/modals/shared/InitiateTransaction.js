import React from 'react';
import { Grid, Flex, Button } from '@makerdao/ui-components-core';

import TransactionStatusIndicator from '../../TransactionStatusIndicator';
import Stepper from '../../Onboarding/shared/Stepper';
import { TransactionStatus } from '../../../utils/constants';
import { StyledTitle, TxInfo } from './styles';

class Transaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };
  }

  onNext = () => {
    this.setState({ step: 1 });
  };

  render() {
    const {
      txHash,
      txStatus,
      txPurpose,
      onComplete,
      account,
      children
    } = this.props;
    const finished =
      txStatus === TransactionStatus.MINED ||
      txStatus === TransactionStatus.ERROR;

    return (
      <Stepper step={this.state.step}>
        <div>{children(this.onNext)}</div>
        <Grid justifyItems="center" gridRowGap="m">
          {txStatus === TransactionStatus.NOT_STARTED && (
            <StyledTitle>
              Approve transaction on {account.proxyRole} wallet
            </StyledTitle>
          )}
          {txStatus === TransactionStatus.PENDING && (
            <StyledTitle>Awaiting confirmation...</StyledTitle>
          )}
          {txStatus === TransactionStatus.MINED && (
            <StyledTitle>Transaction confirmed</StyledTitle>
          )}
          {txStatus === TransactionStatus.ERROR && (
            <StyledTitle>An error occured</StyledTitle>
          )}
          <TransactionStatusIndicator
            provider={account.type}
            tx={txHash}
            status={txStatus}
          />
          {txPurpose && (
            <div>
              <TxInfo style={{ textAlign: 'center' }}>{txPurpose}</TxInfo>
            </div>
          )}
          {finished && (
            <Flex justifyContent="center">
              <Button onClick={onComplete}>Finish and close</Button>
            </Flex>
          )}
        </Grid>
      </Stepper>
    );
  }
}

export default Transaction;
