import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { sendMkrToProxy, withdrawMkr } from '../../reducers/proxy';
import { getActiveAccount } from '../../reducers/accounts';
import { modalClose } from '../../reducers/modal';
import ProxySetup from './ProxySetup';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
// import Button from '../Button';

const SecureVoting = ({ modalClose, activeAccount }) => {
  if (activeAccount.hasProxy) {
    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Secure voting</StyledTitle>
        </StyledTop>
        <StyledBlurb>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
          consequat euismod. Nam sagittis lorem nisl, sed aliquam purus finibus
          eget
        </StyledBlurb>
        <div style={{ textAlign: 'center' }}>
          Locked in voting contract: {activeAccount.proxy.votingPower} MKR
        </div>
        <div
          style={{
            alignSelf: 'center',
            marginTop: '18px'
          }}
        />
      </Fragment>
    );
  } else return <ProxySetup />;
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state)
  }),
  { sendMkrToProxy, modalClose }
)(SecureVoting);
