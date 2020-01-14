import React, { useState } from 'react';
import { Card, Grid, Text } from '@makerdao/ui-components-core';

export default () => {
  const [stakingHistory, setStakingHistory] = useState(false);
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        ESM History
      </Text.h4>
      <Card>
        {!stakingHistory ? (
          <Text.p
            color="#9FAFB9"
            fontWeight="300"
            alignSelf="center"
            p={'xl'}
            textAlign="center"
          >
            No history to show
          </Text.p>
        ) : null}
      </Card>
    </Grid>
  );
};
