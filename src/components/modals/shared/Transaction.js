import React, { Fragment } from 'react';
import styled from 'styled-components';

import { AccountTypes } from '../../../utils/constants';
import { ethScanLink } from '../../../utils/ethereum';
import { StyledTitle, StyledTop, TxInfo, TxHash } from './styles';
import Button from '../../Button';
import metamask from '../../../imgs/metamask.svg';
import ledger from '../../../imgs/ledger.svg';
import trezor from '../../../imgs/trezor.png';

const logoImages = {
  [AccountTypes.METAMASK]: metamask,
  [AccountTypes.LEDGER]: ledger,
  [AccountTypes.TREZOR]: trezor
};

const Logo = styled.div`
  background: url(${({ name }) => logoImages[name]}) center no-repeat;
  background-size: contain;
  height: 100px;
  margin: 24px;
`;

const Transaction = ({
  txHash,
  nextStep,
  network,
  txPurpose,
  confirming,
  lastCard,
  account
}) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>
        {txHash ? (
          confirming ? (
            <Fragment>Awaiting confirmation...</Fragment>
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
      {txHash ? (
        <Fragment>
          <TxHash
            href={ethScanLink(txHash, network)}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on Etherscan
          </TxHash>
          <br />
          <Button
            loading={confirming}
            disabled={confirming || !txHash}
            style={{ marginTop: '10px' }}
            slim
            onClick={nextStep}
          >
            {lastCard ? 'Finish and close' : 'Continue'}
          </Button>
        </Fragment>
      ) : (
        <TxInfo>{txPurpose}</TxInfo>
      )}
    </div>
  </Fragment>
);

Transaction.defaultProps = {
  account: {
    proxyRole: ''
  }
};

export default Transaction;
