import React from 'react';
import useMakerTx from './hooks/useMakerTx';

import { Button, Text, Flex } from '@makerdao/ui-components';

const SomeComponent = () => {
  const tx = useMakerTx(maker =>
    maker.service('voteProxy').voteExec(maker.currentAddress(), [])
  );

  const TX_STATES = {
    [tx.NULL]: <Button onClick={tx.send}>send a transaction!</Button>,
    [tx.INITIALIZED]: <Text t="p1">tx from {tx.sender} initialized</Text>,
    [tx.PENDING]: <Text t="p1">tx {tx.hash} pending</Text>,
    [tx.MINED]: <Text t="p1">tx {tx.hash} mined</Text>,
    [tx.ERROR]: <Text t="p1">tx failed {tx.errorMsg}</Text>
  };

  return <Flex justifyContent="center">{TX_STATES[tx.status]}</Flex>;
};

export default SomeComponent;
