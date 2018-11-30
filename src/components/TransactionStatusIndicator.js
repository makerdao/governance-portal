import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Box, Flex, Grid, Text, Address, Link } from '@makerdao/ui-components';

import WalletIcon from './Onboarding/shared/WalletIcon';
import { TransactionStatus } from '../utils/constants';

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${load} 4s infinite linear;
  height: 100%;
  width: 100%;
`;

const SpinnerBar = styled(Box)`
  border: 3px solid white;
  opacity: 0;
  transition: opacity 0.2s;

  ${props =>
    props.show &&
    `
    opacity: 1;
  `}
`;

const TransactionStatusIndicator = ({ provider, status, tx, ...props }) => {
  return (
    <Grid alignItems="center" justifyItems="center" {...props}>
      <Flex gridArea="1 / 2 / 1 / 2" height="155px" width="155px" zIndex="1">
        {status === TransactionStatus.NOT_STARTED && (
          <SpinnerBar
            borderRadius="50%"
            height="100%"
            width="100%"
            bg="white"
            show={status === TransactionStatus.NOT_STARTED}
          />
        )}

        {status === TransactionStatus.PENDING && (
          <Spinner>
            <SpinnerBar
              borderRadius="100% 0 0 0"
              height="50%"
              width="50%"
              alignSelf="start"
              justifySelf="start"
              bg="makerTeal"
              show={status === TransactionStatus.PENDING}
            />
          </Spinner>
        )}

        {status === TransactionStatus.MINED && (
          <SpinnerBar
            borderRadius="50%"
            height="100%"
            width="100%"
            bg="makerTeal"
            show={status === TransactionStatus.MINED}
          />
        )}

        {status === TransactionStatus.ERROR && (
          <SpinnerBar
            borderRadius="50%"
            height="100%"
            width="100%"
            bg="#F35833"
            show={status === TransactionStatus.ERROR}
          />
        )}
      </Flex>
      <Flex
        gridArea="1 / 2 / 1 / 2"
        bg="#E8EDEF"
        borderRadius="50%"
        height="140px"
        width="140px"
        alignItems="center"
        justifyContent="center"
        zIndex="2"
        style={{ border: '3px solid white' }}
      >
        {!tx && (
          <WalletIcon
            provider={provider}
            style={{ height: '53px', width: '53px' }}
          />
        )}
        {tx && (
          <Box textAlign="center">
            <div>
              <Text
                color="makerTeal"
                fontSize="1.4rem"
                fontWeight="medium"
                lineHeight="1.4rem"
              >
                {status === TransactionStatus.PENDING && 'PENDING'}
                {status === TransactionStatus.MINED && 'CONFIRMED'}
                {status === TransactionStatus.ERROR && 'ERROR'}
              </Text>
            </div>
            <Box mt="-0.6rem">
              <Text
                style={{ whiteSpace: 'nowrap' }}
                fontSize="1.2rem"
                lineHeight="1.2rem"
              >
                TX{' '}
                <Link>
                  <Address full={tx} veryShort />
                </Link>
              </Text>
            </Box>
          </Box>
        )}
      </Flex>
    </Grid>
  );
};

export default TransactionStatusIndicator;
