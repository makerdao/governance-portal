import React from 'react';
import { Box } from '@makerdao/ui-components-core';
import EsmStakeModal from '../EsmStakeModal';
import templates from './templates';

const modals = {
  esmstake: ({ onClose }) => (
    <Box
      bg="backgroundGrey"
      minHeight="100vh"
      p="m"
      onClick={e => e.stopPropagation()}
    >
      <EsmStakeModal onClose={onClose} />
    </Box>
  )
};

export { templates };
export default modals;
