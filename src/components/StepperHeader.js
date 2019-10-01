import React from 'react';
import { Flex, Grid, Box, Text } from '@makerdao/ui-components-core';
import ActiveAccount from './ActiveAccount';
// import useMaker from 'hooks/useMaker';
// import { ReactComponent as CloseIcon } from 'images/close-circle.svg';

const mockAddress = '0xa24df0420de1f3b8d740a52aaeb9d55d6d64478e';

const StepperHeader = ({ onClose }) => {
  //   const { account } = useMaker();
  return (
    <Flex justifyContent="flex-end" mb="m">
      <Grid
        gridColumnGap="xl"
        gridTemplateColumns="auto auto"
        alignItems="center"
      >
        <Box>
          <ActiveAccount
            address={mockAddress}
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
          {/* <CloseIcon /> */}
          <Text color="steel" t="1.6rem" fontWeight="medium">
            Close
          </Text>
        </Grid>
      </Grid>
    </Flex>
  );
};

export default StepperHeader;
