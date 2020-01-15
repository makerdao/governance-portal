import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Box } from '@makerdao/ui-components-core';

const loaderAnimation = keyframes`
  0% { margin-left: 0%;}
  100%{ margin-left 72%;}
`;

const IndicatorContainer = styled(Box)`
  align-self: center;
  height: 2px;
  width: 160px;
  background-color: #c4c4c4;
`;
const Indicator = styled(Box)`
  animation: 1s linear infinite alternate ${loaderAnimation};
  width: 46px;
  height: 2px;
  background-color: #e67002;
`;
export default () => {
  return (
    <IndicatorContainer mt="l">
      <Indicator />
    </IndicatorContainer>
  );
};
