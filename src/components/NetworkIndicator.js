import React from 'react';
import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

const Circle = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${({ network }) =>
    network === 'kovan' ? '#9055AF' : '#30bd9f'};
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
`;

const NetworkIndicator = ({ network, ...props }) => {
  return (
    <Box style={{ textTransform: 'capitalize' }} {...props}>
      <Circle network={network} />
      {network}
    </Box>
  );
};

export default NetworkIndicator;
