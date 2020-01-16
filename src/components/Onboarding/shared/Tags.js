import React from 'react';
import { Box } from '@makerdao/ui-components-core';

export const HotWalletTag = props => (
  <Box
    borderRadius="4px"
    color="red"
    bg="reds.light"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    style={{ whiteSpace: 'nowrap' }}
    {...props}
  >
    <p>HOT WALLET</p>
  </Box>
);

export const ColdWalletTag = props => (
  <Box
    borderRadius="4px"
    color="blue"
    bg="blues.light"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    {...props}
  >
    <p>COLD WALLET</p>
  </Box>
);

export const SingleWalletTag = props => (
  <Box
    borderRadius="4px"
    color="blue"
    bg="blues.light"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    {...props}
  >
    <p>YOUR WALLET</p>
  </Box>
);

export const VotingContractTag = props => (
  <Box
    borderRadius="4px"
    color="green"
    bg="greens.light"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    {...props}
  >
    <p>VOTING CONTRACT</p>
  </Box>
);

export const GreyTag = ({ children, ...props }) => {
  return (
    <Box
      borderRadius="4px"
      display="inline-block"
      color="grey"
      bg="greys.veryLight"
      fontWeight="bold"
      px="xs"
      {...props}
    >
      <p>{children}</p>
    </Box>
  );
};
