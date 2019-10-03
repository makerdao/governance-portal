import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import styled from 'styled-components';

const TextBlock = styled(Text)`
  display: block;
`;

const ScreenHeader = ({ title, text }) => {
  return (
    <Box textAlign="center" pt="m">
      <Box pb="m">
        <TextBlock t="h2">{title}</TextBlock>
      </Box>
      <TextBlock t="body" fontSize="1.8rem">
        {text}
      </TextBlock>
    </Box>
  );
};

export default ScreenHeader;
