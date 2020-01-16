import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import { H2 } from '../../../utils/typography';

const OnboardingHeader = ({ title, subtitle, ...props }) => {
  return (
    <Box textAlign="center" {...props}>
      <Box mb="s">
        <H2>{title}</H2>
      </Box>
      <Text t="p2">
        <p>{subtitle}</p>
      </Text>
    </Box>
  );
};

export default OnboardingHeader;
