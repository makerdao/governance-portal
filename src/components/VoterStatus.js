import { connect } from 'react-redux';
import React from 'react';
import styled from 'styled-components';
import { modalOpen } from '../reducers/modal';
import { Link } from 'react-router-dom';
import theme, { colors, fonts } from '../theme';
import DotSpacer from './DotSpacer';
import { cutMiddle } from '../utils/misc';

const SmallText = styled.p`
  margin-top: 20px;
  margin-bottom: 16px;
  text-align: left;
  line-height: 1.8;
  font-size: ${fonts.size.small};
  color: ${theme.text.dim_grey};
`;

const Value = styled.span`
  color: rgb(${colors.black});
`;

const VoterStatus = ({ votingContract, account, network }) => {
  const domain = `${network === 'kovan' ? 'kovan.' : ''}etherscan.io`;
  const etherscanUrl = `https://${domain}/address/${account.address}`;
  return (
    <SmallText>
      In voting contract <Value>{votingContract.balance} MKR</Value>{' '}
      <a>Withdraw to wallet</a>
      <DotSpacer />
      In wallet <Value>{account.balance || 0} MKR</Value>{' '}
      <a>Add to voting contract</a>
      <DotSpacer />
      Hot wallet address {cutMiddle(account.address)}{' '}
      <a target="_blank" href={etherscanUrl}>
        Etherscan
      </a>
      <br />
      Currently voting for{' '}
      <Link to="/foundation-proposal/vote-yes-to-the-five-core-principles-of-the-maker-governance-philosophy">
        Vote YES to the five core principles of the Maker Governance philosophy
      </Link>
    </SmallText>
  );
};

const mapStateToProps = state => ({
  votingContract: {
    isSetup: true,
    balance: 888
  },
  account: state.accounts.activeAccount,
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { modalOpen }
)(VoterStatus);
