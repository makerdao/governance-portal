import React from 'react';
import { Card, Grid, Box, Link, Grid } from '@makerdao/ui-components';

const AccountDisplayBox = ({ accountType, address, eth, mkr }) => (
  <Card p="m" gridColumn="1/3">
    <Grid
      alignItems="center"
      gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr auto']}
      gridColumnGap="s"
    >
      <Box>
        <WalletIcon
          provider={accountType}
          style={{ maxWidth: '27px', maxHeight: '27px' }}
        />
      </Box>
      <Box>
        <Link fontWeight="semibold">
          <Address full={hotWallet.address} shorten />
        </Link>
      </Box>
      <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
        {hotWallet.eth || 0} ETH, {hotWallet.mkr || 0} MKR
      </Box>
      <Box
        borderRadius="4px"
        color="#E45432"
        bg="#FFE2D9"
        fontSize="1.2rem"
        fontWeight="bold"
        px="xs"
      >
        HOT WALLET
      </Box>
    </Grid>
  </Card>
);
