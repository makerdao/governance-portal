import React from 'react';
import { connect } from 'react-redux';
import { Grid, Box, Button, Flex } from '@makerdao/ui-components';

import { getAccount } from '../../reducers/accounts';
import Header from './shared/Header';
import Sidebar from './shared/Sidebar';

const StartVoting = ({ onComplete, hotWallet, coldWallet }) => {
  return (
    <Box maxWidth="930px" m="0 auto">
      <Grid
        gridColumnGap="xl"
        gridRowGap="m"
        gridTemplateColumns={['1fr', '1fr', '340px auto']}
      >
        <Sidebar hotWallet={hotWallet} coldWallet={coldWallet} />
        <div>
          <Grid gridRowGap="l" maxWidth="440px">
            <Header
              title="Set up complete!"
              subtitle="Thank you for setting up your secure voting contract.
    You are now ready to impact the system."
              mt="l"
            />
            <Flex justifyContent="center">
              <Button
                py="s"
                px="l"
                onClick={onComplete}
                style={{ fontSize: '2.2rem', fontWeight: 400 }}
              >
                Start voting
              </Button>
            </Flex>
          </Grid>
        </div>
      </Grid>
    </Box>
  );
};

export default connect(
  ({ onboarding, ...state }) => ({
    hotWallet: getAccount(state, onboarding.hotWallet.address),
    coldWallet: getAccount(state, onboarding.coldWallet.address)
  }),
  {}
)(StartVoting);
