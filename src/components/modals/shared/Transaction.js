import React, { Fragment } from 'react';
import { ethScanLink } from '../../../utils/ethereum';

import { StyledTitle, StyledTop, TxHash, Note } from './styles';
import Button from '../../Button';

const Transaction = ({ txHash, nextStep, network, lastCard }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Transaction Hash</StyledTitle>
    </StyledTop>
    <TxHash href={ethScanLink(txHash, network)} target="_blank">
      {txHash}
    </TxHash>
    <Note>Please wait for the tx to mine before continuing</Note>
    <div
      style={{
        alignSelf: 'center',
        marginTop: '18px'
      }}
    >
      <Button slim onClick={nextStep}>
        {lastCard ? 'Finish and close' : 'Continue'}
      </Button>
    </div>
  </Fragment>
);

export default Transaction;
