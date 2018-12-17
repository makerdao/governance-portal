import { connect } from 'react-redux';
import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { modalOpen } from '../reducers/modal';
import { getActiveAccount } from '../reducers/accounts';
import theme from '../theme';
import DotSpacer from './DotSpacer';
import WithVote from './hocs/WithVote';
import {
  Flag,
  Banner,
  BannerHeader,
  BannerBody,
  BannerContent
} from './Banner';
import Button from './Button';
import Loader from './Loader';
import { cutMiddle, firstLetterCapital, formatRound } from '../utils/misc';
import { ethScanLink } from '../utils/ethereum';
import Lock from './modals/Lock';
import Withdraw from './modals/Withdraw';
import ProxySetup from './modals/ProxySetup';

const fadeIn = keyframes`
0% {
  opacity: 0;
}
100% {
  opacity: 1;
}
`;

const FadeIn = styled.div`
  animation: ${fadeIn} 0.75s forwards;
`;

const SmallMediumText = styled.p`
  margin-top: 20px;
  margin-bottom: 50px;
  text-align: left;
  line-height: 2;
  font-size: 14px;
  color: ${theme.text.dim_grey};
`;

const Black = styled.span`
  color: ${theme.text.default};
`;

const Strong = styled(Black)`
  color: ${theme.text.default};
  font-weight: bold;
`;

const StyledLink = styled(Link)`
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  color: ${({ disabled }) => (disabled ? 'black' : '')};
`;

const Content = styled.div`
  display: flex;
`;

const BorderBottom = styled.div`
  height: 1px;
  background: #dbdddd;
  position: absolute;
  top: 228px;
  left: 0;
  width: 100%;
`;

const TextButton = styled.span`
  color: ${theme.text.blue_link};
  cursor: pointer;
`;

const WelcomeBanner = ({ modalOpen }) => {
  return (
    <Banner>
      <Content>
        <Flag mr={20} mt="-2" />
        <BannerBody>
          <BannerHeader>
            Welcome to the governance voting dashboard
          </BannerHeader>
          <BannerContent>
            Before you can get started voting you will need to set up a voting
            contract
          </BannerContent>
        </BannerBody>
      </Content>
      <Button
        slim
        color={'grey'}
        hoverColor={'grey'}
        textColor={theme.text.darker_default}
        hoverTextColor={theme.text.darker_default}
        activeColor={'grey'}
        onClick={() => modalOpen(ProxySetup)}
      >
        Set up now
      </Button>
    </Banner>
  );
};

const Padding = styled.div`
  margin-top: 20px;
`;

const VoterStatus = ({ account, network, modalOpen, fetching, signaling }) => {
  if (fetching) {
    return (
      <Padding>
        <Loader mt={34} mb={34} color="header" background="background" />
      </Padding>
    );
  }
  if (!account || !account.hasProxy)
    return (
      <FadeIn>
        <WelcomeBanner modalOpen={modalOpen} />
      </FadeIn>
    );
  const { linkedAccount } = account.proxy;
  const isColdWallet = account.proxyRole === 'cold';
  const coldWallet = isColdWallet ? account : linkedAccount;
  return (
    <FadeIn>
      <SmallMediumText>
        <Strong>{isColdWallet ? 'Cold wallet:' : 'Hot wallet:'}</Strong> In
        voting contract{' '}
        <Black>{formatRound(account.proxy.votingPower, 4)} MKR</Black>{' '}
        {account.proxyRole === 'cold' && Number(account.mkrBalance) > 0 && (
          <TextButton onClick={() => modalOpen(Lock)}>Top-up</TextButton>
        )}
        {account.proxyRole === 'cold' &&
          Number(account.proxy.votingPower) > 0 && <span> | </span>}
        {Number(account.proxy.votingPower) > 0 && (
          <TextButton onClick={() => modalOpen(Withdraw)}>Withdraw</TextButton>
        )}
        <DotSpacer />
        In cold wallet{' '}
        <Black>{formatRound(coldWallet.mkrBalance, 4)} MKR</Black> <DotSpacer />
        {linkedAccount.address !== '0x' && (
          <Fragment>
            {firstLetterCapital(linkedAccount.proxyRole)} wallet:{' '}
            {cutMiddle(linkedAccount.address)}{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={ethScanLink(linkedAccount.address, network)}
            >
              Etherscan
            </a>
          </Fragment>
        )}
        <br />
        {account.votingFor && account.proxy.votingPower > 0 ? (
          <Fragment>
            <WithVote proposalAddress={account.votingFor} signaling={signaling}>
              {({ proposalTitle, proposalSlug, noVote }) =>
                noVote ? (
                  'Currently not voting'
                ) : (
                  <Fragment>
                    Currently voting for{' '}
                    <StyledLink disabled={noVote} to={proposalSlug}>
                      {proposalTitle}
                    </StyledLink>
                  </Fragment>
                )
              }
            </WithVote>
          </Fragment>
        ) : (
          'Currently not voting'
        )}
      </SmallMediumText>
      <BorderBottom />
    </FadeIn>
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
