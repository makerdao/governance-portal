import React from 'react';
import { Box, Grid } from '@makerdao/ui-components';

const SidebarLayout = ({ children, ...props }) => {
  return (
    <Box maxWidth="930px" m="0 auto" {...props}>
      <Grid
        gridColumnGap="xl"
        gridRowGap="m"
        gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
      >
        {children}
      </Grid>
    </Box>
  );
};

export default SidebarLayout;
