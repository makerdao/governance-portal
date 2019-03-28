import React from 'react';
import { Grid, Flex, Button } from '@makerdao/ui-components';

import TransactionStatusIndicator from '../../TransactionStatusIndicator';
import OnboardingHeader from './OnboardingHeader';

import { TransactionStatus } from '../../../utils/constants';

const SignTransactionStep = ({
  walletProvider,
  title,
  subtitle,
  status,
  tx,
  onNext,
  onRetry,
  onCancel
}) => {
  return (
    <Grid gridRowGap="l" justifyItems="center">
      <OnboardingHeader title={title} subtitle={subtitle} />
      <TransactionStatusIndicator
        provider={walletProvider}
        status={status}
        tx={tx}
      />
      <Flex justifyContent="center">
        {onCancel && (
          <Button variant="secondary-outline" onClick={onCancel} mr="s">
            Cancel
          </Button>
        )}
        {status !== TransactionStatus.ERROR && onNext && (
          <Button
            disabled={
              status !== TransactionStatus.MINED &&
              status !== TransactionStatus.CONFIRMED
            }
            onClick={onNext}
          >
            Next
          </Button>
        )}
        {status === TransactionStatus.ERROR && onRetry && (
          <Button onClick={onRetry}>Retry</Button>
        )}
      </Flex>
    </Grid>
  );
};

export default SignTransactionStep;
