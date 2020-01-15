import React, { Fragment } from 'react';
import { Button, Text, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../../imgs/arrowTopRight.svg';
import LoadingBar from '../../LoadingBar';

export default ({ onClose, migrationTxHash, network }) => {
  return (
    <Fragment>
      <Text.h2 mt="m" textAlign="center">
        Your MKR is being burned
      </Text.h2>
      <Text
        style={{ fontSize: 17, color: '#48495F' }}
        mt="m"
        textAlign="center"
      >
        The estimated time is 8 minutes. You can close this modal
      </Text>
      <Link
        justifySelf="center"
        target="_blank"
        mt="m"
        // href={etherscanLink(migrationTxHash, network)}
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
      <LoadingBar />
      <Button
        variant="secondary-outline"
        color="black"
        onClick={onClose}
        width={'10em'}
        mt={'xl'}
      >
        Back
      </Button>
    </Fragment>
  );
};
