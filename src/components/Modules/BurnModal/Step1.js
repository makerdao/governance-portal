import React, { useState } from 'react';
import {
  Box,
  Grid,
  Input,
  Flex,
  Button,
  Text,
  Link
} from '@makerdao/ui-components-core';

export default ({
  onClose,
  onContinue,
  mkrBalance,
  update,
  value,
  deposits
}) => {
  const [error, setError] = useState('');
  const [localValue, setLocalValue] = useState(value);
  const setMax = () => {
    setLocalValue(mkrBalance);
  };
  const isNotValid = value => {
    return value >= mkrBalance ? `You don't have enough MKR` : false;
  };
  const onChange = event => {
    const { value } = event.target;
    setLocalValue(value);

    if (isNaN(parseFloat(value)))
      return setError('Please enter a valid number');

    const newError = isNotValid(value);
    if (newError) setError(newError);
    // try {
    //   newError = isValid(value);
    //   // if (!newError) update(value);
    // } catch (e) {
    //   newError = e.message;
    // }
  };
  return (
    <Grid gridRowGap="m" justifyContent="center">
      <Text.h2 mt="m" textAlign="center">
        Burn your MKR in the ESM
      </Text.h2>
      <Grid
        gridRowGap="s"
        width={'30em'}
        border="1px solid #D4D9E1"
        alignSelf="center"
      >
        <Text.h5 textAlign="left" mt="m" ml="m" fontWeight="500">
          Enter the amount of MKR to burn.
        </Text.h5>
        <Input
          mx={'m'}
          type="number"
          value={localValue}
          placeholder={`0.00 MKR`}
          onChange={onChange}
          failureMessage={error}
          after={
            <Link color="blue" fontWeight="medium" onClick={setMax}>
              Set max
            </Link>
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
            {`${mkrBalance && mkrBalance.toString()} MKR`}
          </Text>
        </Flex>
      </Grid>
      {deposits > 0 ? (
        <Flex
          mt="xs"
          mb="s"
          border={'1px solid #FBCC5F'}
          style={{ backgroundColor: '#FFF9ED' }}
          borderRadius={6}
          alignItems="center"
          justifyContent="center"
        >
          <Text
            my="s"
            style={{ textAlign: 'center', fontSize: 14, color: '#826318' }}
          >
            {`You have ${deposits} additional MKR locked in DSChief.`}
            <br />
            {`Withdraw MKR from DSChief to burn it in the ESM.`}
          </Text>
        </Flex>
      ) : null}
      <Flex flexDirection="row" justifyContent="center" m={'m'}>
        <Button
          variant="secondary-outline"
          color="black"
          onClick={onClose}
          mr="s"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          disabled={!!error}
          onClick={() => {
            onContinue(2);
            update(localValue);
          }}
          ml="s"
        >
          Continue
        </Button>
      </Flex>
    </Grid>
  );
};
