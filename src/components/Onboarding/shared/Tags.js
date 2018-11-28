import React from 'react';
import { Box } from '@makerdao/ui-components';

export const HotWalletTag = props => (
  <Box
    borderRadius="4px"
    color="#E45432"
    bg="#FFE2D9"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    style={{ whiteSpace: 'nowrap' }}
    {...props}
  >
    HOT WALLET
  </Box>
);

export const ColdWalletTag = props => (
  <Box
    borderRadius="4px"
    color="#447AFB"
    bg="#EAF0FF"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    {...props}
  >
    COLD WALLET
  </Box>
);

export const VotingContractTag = props => (
  <Box
    borderRadius="4px"
    color="#30BD9F"
    bg="#C3F5EA"
    fontSize="1.2rem"
    fontWeight="bold"
    px="xs"
    {...props}
  >
    VOTING CONTRACT
  </Box>
);
