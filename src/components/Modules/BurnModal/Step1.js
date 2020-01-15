import React, { useState } from 'react';
import { Grid, Input, Flex, Button, Text } from '@makerdao/ui-components-core';

export default ({ onClose, onContinue }) => {
  const [mkrBalance, setMkrBalance] = useState(0);
  return (
    <Grid gridRowGap="m" justifyContent="center">
      <Text.h2 mt="m" textAlign="center">
        Burn your MKR in the ESM
      </Text.h2>
      <Grid gridRowGap="s" width={'30em'} border="1px solid #D4D9E1">
        <Text.h5 textAlign="left" mt="m" ml="m" fontWeight="500">
          Enter the amount of MKR to burn.
        </Text.h5>
        <Input
          mx={'m'}
          after={
            <button
              css="text-decoration:none"
              style={{ color: '#447AFB', fontSize: 15, fontWeight: '500' }}
            >
              Set Max
            </button>
          }
        />
        <Flex flexDirection="row" ml="m" alignItems="center" mb="m">
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 11,
              color: '#708390',
              lineHeight: 1
            }}
          >
            MKR BALANCE IN WALLET
          </Text>
          <Text
            t="caption"
            ml="s"
            style={{ fontSize: 14, color: '#48495F', lineHeight: 1 }}
          >
            {`${mkrBalance.toFixed(2)} MKR`}
          </Text>
        </Flex>
      </Grid>
      <Flex flexDirection="row" justifyContent="center" m={'m'}>
        <Button
          variant="secondary-outline"
          color="black"
          onClick={onClose}
          mr="s"
        >
          Cancel
        </Button>
        <Button variant="danger" onClick={() => onContinue(2)} ml="s">
          Continue
        </Button>
      </Flex>
    </Grid>
  );
};
