import React, { Fragment } from 'react';
import styled from 'styled-components';

import { ethScanLink } from '../../../utils/ethereum';
import { StyledTitle, StyledTop, TxHash } from './styles';
import Button from '../../Button';
import Loader from '../../Loader';
import metamask from '../../../imgs/metamask.svg';
import ledger from '../../../imgs/ledger.svg';
import trezor from '../../../imgs/trezor.png';

const logoImages = { metamask, ledger, trezor };

const Logo = styled.div`
  background: url(${({ name }) => logoImages[name]}) center no-repeat;
  background-size: contain;
  height: 100px;
  margin: 24px;
`;

const InlineLoader = styled(Loader)`
  display: inline-block;
  margin-left: 1em;
`;

const Transaction = ({
  txHash,
  nextStep,
  network,
  confirming,
  lastCard,
  account
}) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>
        {txHash ? (
          confirming ? (
            <Fragment>
              Waiting for confirmation...
              <InlineLoader size={20} color="header" background="white" />
            </Fragment>
          ) : (
            'Transaction confirmed'
          )
        ) : (
          <Fragment>Approve transaction on {account.proxyRole} wallet</Fragment>
        )}
      </StyledTitle>
    </StyledTop>
    <Logo name={account.type.toLowerCase()} />
    <div
      style={{
        alignSelf: 'center',
        textAlign: 'center'
      }}
    >
      {txHash && (
        <Fragment>
          <TxHash href={ethScanLink(txHash, network)} target="_blank">
            View on Etherscan
          </TxHash>
          <br />
          {!confirming && (
            <Button slim onClick={nextStep}>
              {lastCard ? 'Finish and close' : 'Continue'}
            </Button>
          )}
        </Fragment>
      )}
    </div>
  </Fragment>
);

export default Transaction;
