import React, { Fragment } from 'react';
import styled from 'styled-components';
import warning from '../../../imgs/warning.svg';
import { Button, Flex, Text, Link } from '@makerdao/ui-components-core';

const WarningIcon = styled.p`
  width: 63px;
  height: 57px;
  background-color: #f77249;
  mask: url(${warning}) center no-repeat;
`;

export default ({ onClose, onContinue }) => {
  return (
    <Fragment>
      <WarningIcon />
      <Text.h2 mt="m">Are you sure you want to burn MKR?</Text.h2>
      <Text.p mt="m" mx="l" textAlign="center">
        {`By burning your MKR in the ESM, you are contributing to the
         shutdown of the Dai Credit System. Your MKR will be immediately burned
          and cannot be retrieved.`}
        {` `}
        <Link
          target="_blank"
          rel="noopener noreferrer"
          css="text-decoration: none"
        >
          Read the ESM documentation.
        </Link>
      </Text.p>
      <Flex flexDirection="row" justifyContent="space-around" m={'m'}>
        <Button
          variant="secondary-outline"
          color="black"
          onClick={onClose}
          mr={'s'}
        >
          Cancel
        </Button>
        <Button variant="danger" ml={'s'} onClick={() => onContinue(1)}>
          Continue
        </Button>
      </Flex>
    </Fragment>
  );
};
