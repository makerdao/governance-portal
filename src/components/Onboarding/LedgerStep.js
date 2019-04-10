import React from 'react';
import { Grid, Box, Button } from '@makerdao/ui-components';

import ButtonCard from './shared/ButtonCard';
import WalletIcon from './shared/WalletIcon';
import OnboardingHeader from './shared/OnboardingHeader';
import { BreakableText } from '../../utils/typography';

const LedgerStep = ({ active, onLedgerLive, onLedgerLegacy, onCancel }) => {
  return (
    <Grid gridRowGap="m">
      <OnboardingHeader
        mt={[0, 0, 0, 'l']}
        title="Ledger live or legacy"
        subtitle="Due to a firmware update, you will need to choose between Ledger
      Live and Ledger legacy."
      />
      <ButtonCard
        icon={<WalletIcon provider="ledger" />}
        onNext={onLedgerLive}
        title="Ledger live"
        subtitle={
          <span>
            Derivation Path:
            <br />
            <BreakableText color="grey">
              {
                // eslint-disable-next-line
                "44'/60'/0'"
              }
            </BreakableText>
          </span>
        }
        buttonText="Connect"
      />
      <ButtonCard
        icon={<WalletIcon provider="ledger" />}
        onNext={onLedgerLegacy}
        title="Ledger legacy"
        subtitle={
          <span>
            Derivation Path:
            <br />
            <BreakableText color="grey">
              {
                // eslint-disable-next-line
                "44'/60'/0'"
              }
            </BreakableText>
          </span>
        }
        buttonText="Connect"
      />
      <Box justifySelf="center">
        <Button variant="secondary-outline" onClick={onCancel}>
          Select another wallet
        </Button>
      </Box>
    </Grid>
  );
};

export default LedgerStep;
