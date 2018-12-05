import React from 'react';
import { connect } from 'react-redux';
import { Grid, Button, Flex } from '@makerdao/ui-components';

import { getAccount } from '../../reducers/accounts';
import Header from './shared/Header';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import Sidebar from './shared/Sidebar';

const StartVoting = ({ onComplete, hotWallet, coldWallet }) => {
  return (
    <TwoColumnSidebarLayout
      sidebar={<Sidebar hotWallet={hotWallet} coldWallet={coldWallet} />}
      sidebarPosition="left"
    >
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
    </TwoColumnSidebarLayout>
  );
};

export default connect(
  ({ onboarding, ...state }) => ({
    hotWallet: getAccount(state, onboarding.hotWallet.address),
    coldWallet: getAccount(state, onboarding.coldWallet.address)
  }),
  {}
)(StartVoting);
