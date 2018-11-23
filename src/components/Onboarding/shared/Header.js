import React from 'react';
import styled from 'styled-components';
import { Box, Text } from '@makerdao/ui-components';

const H2 = styled.h2`
  font-weight: 500;
  font-size: 3.2rem;
  letter-spacing: 0.03rem;
`;

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
