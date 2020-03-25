import React, { Fragment } from 'react';
import styled from 'styled-components';
import warning from '../../../imgs/warning.svg';
import { Button, Flex, Text } from '@makerdao/ui-components-core';

const WarningIcon = styled.p`
  width: 63px;
  height: 57px;
  background-color: #f77249;
  mask: url(${warning}) center no-repeat;
`;

export default ({ onClose }) => {
  return (
    <Fragment>
      <WarningIcon />
      <Text.h2 mt="m">Emergency Security Module</Text.h2>
      <Text.p mt="m" mx="l" textAlign="center">
        {`The Emergency Shutdown Module (ESM) is responsible for a
          process that gracefully shuts down the Maker Protocol.
          This acts as a last resort to protect against a serious
          threat, such as but not limited to governance attacks,
          long-term market irrationality, hacks and security breaches.
        `}
      </Text.p>
      <Text.p mt="m" mx="l" textAlign="center">
        {`The following screens allow the user to burn MKR in support
          of Emergency Shutdown. Outside of Governance, burning ones
          tokens in the Emergency Shutdown Module (ESM) is a
          non-reversible action.`}
        {` `}
      </Text.p>
      <Text.p fontWeight="500">Your MKR will be permanently burnt.</Text.p>
      <Flex flexDirection="row" justifyContent="space-around" m={'m'}>
        <Button variant="danger" ml={'s'} onClick={onClose}>
          Continue
        </Button>
      </Flex>
    </Fragment>
  );
};
