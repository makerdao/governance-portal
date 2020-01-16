import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Text, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../../imgs/arrowTopRight.svg';
import LoadingBar from '../../LoadingBar';
import { etherscanLink } from '../../../utils/ui';

const Step3 = ({ onClose, burnTxHash, network }) => {
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
        Your MKR is being burned
      </Text.h2>
      <Text
        style={{ fontSize: 17, color: '#48495F' }}
        mt="m"
        textAlign="center"
      >
        The estimated time is {waitTime || 'being calculated'}. You can close
        this modal
      </Text>
      {burnTxHash && (
        <Link
          justifySelf="center"
          target="_blank"
          mt="m"
          href={etherscanLink(burnTxHash, network)}
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
        Back
      </Button>
    </Fragment>
  );
};

export default connect(state => ({
  network: state.metamask.network
}))(Step3);
