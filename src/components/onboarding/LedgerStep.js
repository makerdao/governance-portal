import React from 'react';
import { Grid, Box, Text, Button } from '@makerdao/ui-components';

import H2 from './H2';
import Step from './Step';
import ButtonCard from './ButtonCard';

import ledgerImg from '../../imgs/onboarding/ledger-logomark.svg';

const LedgerStep = ({ active, onLedgerLive, onLedgerLegacy, onCancel }) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m">
        <Box textAlign="center" mt={[0, 0, 0, 'l']}>
          <Box mb="s">
            <H2>Ledger live or legacy</H2>
          </Box>
          <Text t="p2">
            <p>
              Due to a firmware update, you will need to choose between Ledger
              Live and Ledger legacy.
            </p>
          </Text>
        </Box>
        <ButtonCard
          imgSrc={ledgerImg}
          onNext={onLedgerLive}
          title="Ledger live"
          subtitle={
            <span>
              Derivation Path:
              <br />
              <Text color="rgba(255, 0, 0, 0.5)">{"44'/60'/0'/${x}"}</Text>
            </span>
          }
        />
        <ButtonCard
          imgSrc={ledgerImg}
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
                {"${purpose}'/${coinType}'/${x}'/0/0"}
              </Text>
            </span>
          }
        />
        <Box justifySelf="center">
          <Button variant="secondary-outline" onClick={onCancel}>
            Select another wallet
          </Button>
        </Box>
      </Grid>
    </Step>
  );
};

export default LedgerStep;
