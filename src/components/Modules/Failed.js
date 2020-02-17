import React from 'react';
import { netIdToName } from '../../utils/ethereum';
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../imgs/arrowTopRight.svg';
import { etherscanLink } from '../../utils/ui';

function Failed(props) {
  const { onClose, txHash } = props;

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">{props.title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {props.subtitle}
      </Text.p>
      {txHash ? (
        <Link
          justifySelf="center"
          target="_blank"
          href={etherscanLink(
            txHash,
            netIdToName(window.maker.service('web3').networkId())
          )}
        >
          <Button
            my="xs"
            justifySelf="center"
            fontSize="s"
            py="xs"
            px="s"
            variant="secondary"
          >
            View transaction details{' '}
            <img alt="link arrow" src={arrowTopRight} />
          </Button>
        </Link>
      ) : (
        ''
      )}
      <Grid gridRowGap="s" justifySelf="center">
        <Button variant="secondary-outline" onClick={onClose}>
          Exit
        </Button>
      </Grid>
    </Grid>
  );
}
export default Failed;
