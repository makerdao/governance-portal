import React from 'react';
import { Card, Grid, Box, Link, Address, Flex } from '@makerdao/ui-components';

import WalletIcon from './WalletIcon';

const walletIconSize = '2.7rem';
const walletIconContainerWidth = '3rem';

const AccountInfo = ({ account, tag, ...props }) => (
  <Card p="m" gridColumn="1/3" {...props}>
    <Grid
      alignItems="center"
      gridTemplateColumns={[
        `${walletIconContainerWidth} 1fr auto`,
        `${walletIconContainerWidth} 1fr 1fr 1fr`
      ]}
      gridColumnGap="s"
    >
      <Flex justifyContent="center">
        <WalletIcon
          provider={account.type}
          style={{ maxWidth: walletIconSize, maxHeight: walletIconSize }}
        />
      </Flex>
      <Box>
        <Link fontWeight="semibold">
          <Address full={account.address} shorten />
        </Link>
      </Box>
      <Box
        gridRow={['2', '1']}
        gridColumn={['1/3', '3']}
        style={{ whiteSpace: 'nowrap' }}
      >
        {account.ethBalance || '0'} ETH, {account.mkrBalance || '0'} MKR
      </Box>
      <Flex justifyContent="flex-end">{tag}</Flex>
    </Grid>
  </Card>
);

export default AccountInfo;
