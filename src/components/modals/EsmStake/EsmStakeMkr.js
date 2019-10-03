import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../../ScreenFooter';

const EsmStakeMkr = ({ dispatch }) => {
  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        Stake MKR in the Emergency Shudown Module
      </Text.h2>
      <Text.p textAlign="center" mb="xl">
        Staking in the ESM should be done with extreme caution. The MKR staked
        cannot be withdrawn except through an executive vote.
      </Text.p>
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={() => dispatch({ type: 'decrement-step' })}
      />
    </Box>
  );
};

export default EsmStakeMkr;
