import React from 'react';
import { Box, Text, Button } from '@makerdao/ui-components-core';

const ModalTest = ({ dispatch, onClose }) => {
  return (
    <Box maxWidth="71.8rem">
      <Button onClick={onClose} width="145px">
        Exit
      </Button>
      <Text.h2 textAlign="center" mb="xl">
        Modal Test
      </Text.h2>
    </Box>
  );
};

export default ModalTest;
