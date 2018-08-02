import { connect } from 'react-redux';
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import round from 'lodash.round';

import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import theme, { fonts } from '../theme';
import DotSpacer from './DotSpacer';
import WithVote from './hocs/WithVote';
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

const Black = styled.span`
  color: ${theme.text.default};
`;

const Strong = Black.extend`
  color: ${theme.text.default};
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  color: ${({ disabled }) => (disabled ? 'black' : '')};
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
  if (!account) return <Padding />;
  if (!account.hasProxy) return <WelcomeBanner modalOpen={modalOpen} />;
  const networkShown = network === 'kovan' ? 'kovan' : 'mainnet';
  const { linkedAccount } = account.proxy;
  const isColdWallet = account.proxyRole === 'cold';
  const coldWallet = isColdWallet ? account : linkedAccount;
  return (
    <SmallText>
      <Strong>{isColdWallet ? 'Cold wallet:' : 'Hot wallet:'}</Strong> In voting
      contract <Black>{round(account.proxy.votingPower, 4)} MKR</Black>{' '}
      {Number(account.proxy.votingPower) > 0 && (
        <a onClick={() => modalOpen(Withdraw)}>Withdraw</a>
      )}
      <DotSpacer />
      In cold wallet <Black>{round(coldWallet.mkrBalance, 4)} MKR</Black>{' '}
      {account.proxyRole === 'cold' && (
        <a onClick={() => modalOpen(Lock)}>Top-up</a>
      )}
      <DotSpacer />
      {firstLetterCapital(linkedAccount.proxyRole)} wallet:{' '}
      {cutMiddle(linkedAccount.address)}{' '}
      <a
        target="_blank"
        href={ethScanLink(linkedAccount.address, networkShown)}
      >
        Etherscan
      </a>
      <DotSpacer />
      {account.votingFor ? (
        <Fragment>
          Currently voting for{' '}
          <WithVote proposalAddress={account.votingFor}>
            {({ proposalTitle, proposalSlug, noVote }) => (
              <StyledLink disabled={noVote} to={proposalSlug}>
                {cutMiddle(proposalTitle, 20, 10)}
              </StyledLink>
            )}
          </WithVote>
        </Fragment>
      ) : (
        'Currently not voting'
      )}
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
