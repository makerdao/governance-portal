import React from 'react';
import { connect } from 'react-redux';
import { Grid, Text, Button, Link } from '@makerdao/ui-components-core';
import arrowTopRight from '../../../imgs/arrowTopRight.svg';
import { etherscanLink } from '../../../utils/ui';

function Failed(props) {
  const { onClose, burnTxHash, network } = props;

  return (
    <Grid gridRowGap="m" mx={'s'}>
      <Text.h2 textAlign="center">{props.title}</Text.h2>
      <Text.p fontSize="1.7rem" color="darkLavender" textAlign="center">
        {props.subtitle}
      </Text.p>
      {burnTxHash ? (
        <Link
          justifySelf="center"
          target="_blank"
          href={etherscanLink(burnTxHash, network)}
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
export default connect(state => ({
  network: state.metamask.network
}))(Failed);
