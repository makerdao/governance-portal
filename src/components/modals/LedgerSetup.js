import React, { Fragment } from 'react';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Oblique,
  Bold
} from './shared/styles';
import Button from '../Button';
import { connect } from 'react-redux';
import { breakLink } from '../../reducers/proxy';
import Transaction from './shared/Transaction';
import { modalClose } from '../../reducers/modal';
import Withdraw from './Withdraw';
import { modalOpen } from '../../reducers/modal';
import {
  getActiveAccount,
  setActiveAccount,
  getHardwareAccount
} from '../../reducers/accounts';
import { LEDGER } from '../../chain/hw-wallet';

const LedgerSetup = ({ getHardwareAccount, modalClose }) => {
  const path = "44'/60'/0'/0/0";
  const accountsOffset = 0;
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Select Ledger Address</StyledTitle>
      </StyledTop>
      <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }} />
      <div
        style={{
          display: 'flex',
          marginTop: '20px',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          slim
          onClick={() => {
            getHardwareAccount(LEDGER, {
              path: path,
              accountsOffset: accountsOffset
            });
            modalClose();
          }}
        >
          Select
        </Button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { getHardwareAccount, modalClose }
)(LedgerSetup);
