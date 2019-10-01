import React from 'react';
import { Box } from '@makerdao/ui-components-core';
// import ModalTest from './ModalTest/ModalTest';
import ModalTestStepper from '../ModalTestStepper';
import templates from './templates';

const modals = {
  modaltest: ({ onClose }) => (
    <Box
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <ModalTestStepper onClose={onClose} />
    </Box>
  )
};

export { templates };
export default modals;
