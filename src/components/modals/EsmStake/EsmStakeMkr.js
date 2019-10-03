import React from 'react';
import { Box, Text } from '@makerdao/ui-components-core';
import ScreenFooter from '../../ScreenFooter';

const ModalTest = ({ dispatch }) => {
  return (
    <Box maxWidth="71.8rem">
      <Text.h2 textAlign="center" mb="xl">
        Modal Test2
      </Text.h2>
      <ScreenFooter
        onNext={() => dispatch({ type: 'increment-step' })}
        onBack={() => dispatch({ type: 'decrement-step' })}
      />
    </Box>
  );
};

export default ModalTest;
