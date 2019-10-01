import React from 'react';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import ActiveAccount from './ActiveAccount';
import { ReactComponent as CloseIcon } from '../imgs/close-circle.svg';

const StepperHeader = ({ address, onClose }) => {
  return (
    <Flex justifyContent="flex-end" mb="m">
      <Grid
        gridColumnGap="xl"
        gridTemplateColumns="auto auto"
        alignItems="center"
      >
        <Box>
          <ActiveAccount
            address={address}
            textColor="steel"
            t="1.6rem"
            readOnly
            maxWidth="250px"
          />
        </Box>

        <Grid
          onClick={onClose}
          gridTemplateColumns="auto auto"
          alignItems="center"
          gridColumnGap="xs"
          css={{ cursor: 'pointer' }}
        >
          <CloseIcon />
          <Text color="steel" t="1.6rem" fontWeight="medium">
            Close
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

export default StepperHeader;
