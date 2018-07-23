import { connect } from 'react-redux';
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import round from 'lodash.round';

import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import theme, { colors, fonts } from '../theme';
import DotSpacer from './DotSpacer';
import {
  Banner,
  BannerHeader,
  BannerBody,
  BannerContent,
  BannerButton
} from './Banner';
import Loader from './Loader';
import { cutMiddle, firstLetterCapital } from '../utils/misc';
import { ethScanLink } from '../utils/ethereum';
import Lock from './modals/Lock';
import Withdraw from './modals/Withdraw';
import ProxySetup from './modals/ProxySetup';

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

const WelcomeBanner = ({ modalOpen }) => {
  return (
    <Banner>
      <BannerBody>
        <BannerHeader>Welcome to the governance voting dashboard</BannerHeader>
        <BannerContent>
          Before you can get started voting you will need to set up a secure
          voting contract
        </BannerContent>
      </BannerBody>
      <BannerButton onClick={() => modalOpen(ProxySetup)}>
        Set up now
      </BannerButton>
    </Banner>
  );
};

const Padding = styled.div`
  margin-top: 20px;
`;

const VoterStatus = ({ account, network, modalOpen, fetching }) => {
  if (fetching) {
    return (
      <Padding>
        <Loader mt={34} mb={34} color="header" background="background" />
      </Padding>
    );
  }
  if (!account) return <Padding>No accounts found</Padding>;
  if (!account.hasProxy) return <WelcomeBanner modalOpen={modalOpen} />;
  const networkShown = network === 'kovan' ? 'kovan' : 'mainnet';
  const { linkedAccount } = account.proxy;
  const coldWallet = account.proxyRole === 'cold' ? account : linkedAccount;
  return (
    <SmallText>
      In voting contract <Value>{account.proxy.votingPower} MKR</Value>{' '}
      <a onClick={() => modalOpen(Withdraw)}>Withdraw to wallet</a>
      <DotSpacer />
      In cold wallet <Value>{round(coldWallet.mkrBalance, 4)} MKR</Value>{' '}
      <a onClick={() => modalOpen(Lock)}>Add to voting contract</a>
      <DotSpacer />
      {firstLetterCapital(linkedAccount.proxyRole)} wallet address{' '}
      {cutMiddle(linkedAccount.address, 4)}{' '}
      <a
        target="_blank"
        href={ethScanLink(linkedAccount.address, networkShown)}
      >
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
  account: getActiveAccount(state),
  network: state.metamask.network,
  fetching: state.accounts.fetching
});

export default connect(
  mapStateToProps,
  { modalOpen }
)(VoterStatus);
