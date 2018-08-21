import React, { Fragment } from 'react';
import { getActiveAccount } from '../../reducers/accounts';
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

const BreakLink = ({ breakLink, activeAccount }) => {
  const { linkedAccount } = activeAccount.proxy;
  const isColdWallet = activeAccount.proxyRole === 'cold';
  const coldAddress = isColdWallet
    ? activeAccount.address
    : linkedAccount.address;
  const hotAddress = isColdWallet
    ? linkedAccount.address
    : activeAccount.address;
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Break Wallet Link</StyledTitle>
      </StyledTop>
      <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
        <Bold>Cold wallet:</Bold> <Oblique> {coldAddress} </Oblique>
        <br />
        <Bold>Hot wallet:</Bold> <Oblique> {hotAddress} </Oblique>
        <br />
        <div style={{ marginTop: '20px' }}>
          Either your hot or cold wallet can create the break link transaction
        </div>
      </StyledBlurb>
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
            breakLink();
          }}
        >
          Break Link
        </Button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  activeAccount: getActiveAccount(state)
});

export default connect(
  mapStateToProps,
  { breakLink }
)(BreakLink);
