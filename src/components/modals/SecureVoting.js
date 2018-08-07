import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import round from 'lodash.round';

import { sendMkrToProxy } from '../../reducers/proxy';
import { getActiveAccount } from '../../reducers/accounts';
import { modalClose, modalOpen } from '../../reducers/modal';
import { cutMiddle } from '../../utils/misc';
import { ethScanLink } from '../../utils/ethereum';
import ProxySetup from './ProxySetup';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  VoteImpact,
  VoteImpactHeading,
  MkrAmt
} from './shared/styles';

const SecureVoting = ({ modalOpen, activeAccount, network }) => {
  if (activeAccount !== undefined && activeAccount.hasProxy) {
    return (
      <Fragment>
        <StyledTop style={{ justifyContent: 'flex-start' }}>
          <StyledTitle>Secure voting</StyledTitle>
        </StyledTop>
        <StyledBlurb>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed faucibus
          consequat euismod. Nam sagittis lorem nisl, sed aliquam purus finibus
          eget
        </StyledBlurb>
        <VoteImpact>
          <div
            style={{
              width: '100%',
              maxWidth: '180px',
              padding: '8px 18px'
            }}
          >
            <VoteImpactHeading>Total MKR balance</VoteImpactHeading>
            <MkrAmt>
              {round(activeAccount.mkrBalance, 3).toLocaleString()}
            </MkrAmt>
          </div>
          <div
            style={{
              width: '100%',
              padding: '8px 30px',
              maxWidth: '180px',
              borderLeft: '1px solid #DFE1E3'
            }}
          >
            <VoteImpactHeading>In voting contract</VoteImpactHeading>
            <MkrAmt>
              {round(activeAccount.proxy.votingPower, 3).toLocaleString()}
            </MkrAmt>
          </div>
          <div
            style={{
              width: '100%',
              padding: '8px 30px',
              maxWidth: '180px',
              borderLeft: '1px solid #DFE1E3'
            }}
          >
            <VoteImpactHeading>Linked address</VoteImpactHeading>
            <MkrAmt noSuffix>
              {cutMiddle(activeAccount.proxy.linkedAccount.address, 2, 4)}{' '}
              <a
                target="_blank"
                href={ethScanLink(
                  activeAccount.proxy.linkedAccount.address,
                  network
                )}
              >
                Etherscan
              </a>
            </MkrAmt>
          </div>
        </VoteImpact>
        <div
          style={{
            alignSelf: 'center',
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            marginTop: '18px'
          }}
        />
      </Fragment>
    );
  } else return <ProxySetup />;
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state),
    network: state.metamask.network
  }),
  { sendMkrToProxy, modalClose, modalOpen }
)(SecureVoting);
