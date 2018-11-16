import React from 'react';
import { Card, Grid, Box, Text, Button } from '@makerdao/ui-components';

const ButtonCard = ({ icon, title, subtitle, onNext }) => {
  return (
    <Card py="s" px="m">
      <Grid
        alignItems="center"
        gridTemplateColumns={['auto 1fr', 'auto 1fr auto']}
        gridRowGap="s"
        gridColumnGap="s"
      >
        <Box pl="s" pr="m">
          {icon}
        </Box>
        <Box flexGrow="1">
          <h3>
            <Text fontSize="1.9rem" letterSpacing="-0.06rem">
              {title}
            </Text>
          </h3>
          <p>{subtitle}</p>
        </Box>
        <Box gridColumn={['1 / 3', '3']}>
          <Button width="100%" onClick={onNext}>
            Connect
          </Button>
        </Box>
      </Grid>
    </Card>
  );
};

export default ButtonCard;
