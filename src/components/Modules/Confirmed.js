import React, { Fragment } from 'react';
import { netIdToName } from '../../utils/ethereum';
import { Button, Text, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../imgs/arrowTopRight.svg';
import { etherscanLink } from '../../utils/ui';

const Confirmed = ({ onClose, txHash, network, title }) => {
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
        You have successfully burned your MKR in the Emergency Shutdown Module
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

export default Confirmed;
