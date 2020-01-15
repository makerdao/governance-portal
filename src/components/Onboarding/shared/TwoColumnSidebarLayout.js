import React from 'react';
import { Box, Grid } from '@makerdao/ui-components-core';
import { oneOf } from 'prop-types';

const containerWidth = '930px';
const sidebarWidth = '340px';

const TwoColumnSidebarLayout = ({
  children,
  sidebar,
  sidebarPosition,
  ...props
}) => (
  <Box maxWidth={containerWidth} m="0 auto" {...props}>
    <Grid
      gridColumnGap="xl"
      gridRowGap="m"
      gridTemplateColumns={[
        '1fr',
        '1fr',
        sidebarPosition === 'left'
          ? `${sidebarWidth} auto`
          : `auto ${sidebarWidth}`
      ]}
    >
      {sidebarPosition === 'left' && sidebar}
      <div>{children}</div>
      {sidebarPosition === 'right' && sidebar}
    </Grid>
  </Box>
);

TwoColumnSidebarLayout.defaultProps = {
  sidebarPosition: 'right'
};

TwoColumnSidebarLayout.propTypes = {
  sidebarPosition: oneOf(['right', 'left'])
};

export default TwoColumnSidebarLayout;
