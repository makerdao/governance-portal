import React from 'react';
import { Grid, Box, Text, Button } from '@makerdao/ui-components';

import ButtonCard from './shared/ButtonCard';
import WalletIcon from './shared/WalletIcon';
import Header from './shared/Header';

const LedgerStep = ({ active, onLedgerLive, onLedgerLegacy, onCancel }) => {
  return (
    <Grid gridRowGap="m">
      <Header
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
            <Text color="rgba(255, 0, 0, 0.5)">
              {
                // eslint-disable-next-line
                "44'/60'/0'/${x}"
              }
            </Text>
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
            <Text
              color="rgba(255, 0, 0, 0.5)"
              style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              {
                // eslint-disable-next-line
                "${purpose}'/${coinType}'/${x}'/0/0"
              }
            </Text>
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
