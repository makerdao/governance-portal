import React, { Fragment } from 'react';

import { ethScanLink } from '../../../utils/ethereum';
import { StyledTitle, StyledTop, TxHash } from './styles';
import Button from '../../Button';
import Loader from '../../Loader';

const Transaction = ({ txHash, nextStep, network, confirming, lastCard }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>
        {confirming ? 'Waiting for transaction...' : 'Transaction confirmed'}
      </StyledTitle>
    </StyledTop>
    <TxHash href={ethScanLink(txHash, network)} target="_blank">
      {txHash}
    </TxHash>
    {confirming ? (
      <Loader size={20} color="header" background="white" />
    ) : (
      <div />
    )}
    <div
      style={{
        alignSelf: 'center',
        marginTop: '18px'
      }}
    >
      <Button slim disabled={confirming} onClick={nextStep}>
        {lastCard ? 'Finish and close' : 'Continue'}
      </Button>
    </div>
  </Fragment>
);

export default Transaction;
