import React, { Fragment, useState, useEffect } from 'react';
import { netIdToName } from '../../utils/ethereum';
import { Button, Text, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../imgs/arrowTopRight.svg';
import LoadingBar from '../LoadingBar';
import { etherscanLink } from '../../utils/ui';

const InProgress = ({ onClose, txHash, title }) => {
  const [waitTime, setWaitTime] = useState();
  const maker = window.maker;
  useEffect(() => {
    (async () => {
      // this is the default transaction speed
      const waitTime = await maker.service('gas').getWaitTime('fast');
      const minutes = Math.round(waitTime);
      const seconds = Math.round(waitTime * 6) * 10;

      const waitTimeText =
        waitTime < 1
          ? `${seconds} seconds`
          : `${minutes} minute${minutes === 1 ? '' : 's'}`;

      setWaitTime(waitTimeText);
    })();
  }, [maker]);

  return (
    <Fragment>
      <Text.h2 mt="m" textAlign="center">
        {title}
      </Text.h2>
      <Text
        style={{ fontSize: 17, color: '#48495F' }}
        mt="m"
        textAlign="center"
      >
        The estimated time is {waitTime || 'being calculated'}. You can close
        this modal.
      </Text>
      {txHash && (
        <Link
          justifySelf="center"
          target="_blank"
          mt="m"
          href={etherscanLink(
            txHash,
            netIdToName(window.maker.service('web3').networkId())
          )}
        >
          <Button
            justifySelf="center"
            fontSize="s"
            py="xs"
            px="s"
            variant="secondary"
          >
            View transaction details{' '}
            <img alt="top right arrow" src={arrowTopRight} />
          </Button>
        </Link>
      )}
      <LoadingBar />
      <Button
        variant="secondary-outline"
        color="black"
        onClick={onClose}
        width={'10em'}
        mt={'xl'}
      >
        Exit
      </Button>
    </Fragment>
  );
};

export default InProgress;
