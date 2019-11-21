import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import mixpanel from 'mixpanel-browser';
import { Footer } from '@makerdao/ui-components';
import { colors, fonts } from '../theme';
import { onboardingOpen, OnboardingStates } from '../reducers/onboarding';
import { modalOpen } from '../reducers/modal';
import Modals from '../components/modals';
import Onboarding from '../components/Onboarding';
import Loader from '../components/Loader';
import AccountBox from '../components/AccountBox';
import Toasts from '../components/Toasts';
import NetworkIndicator from '../components/NetworkIndicator';
import SecureVoting from '../components/modals/SecureVoting';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-width: 1200px;
`;

const AppWrapper = styled.div`
  min-height: 400px;
  padding: 0px 16px;
`;

const StyledColumn = styled.div`
  align-items: center;
  max-width: 1140px;
  margin: auto;
`;

const StyledHeader = styled.div`
  margin-top: -1px;
  width: 100%;
  display: block;
  align-items: center;
  background-color: rgb(${colors.header});
  color: rgb(${colors.white});
`;

const HeaderBottom = styled.div`
  width: 100%;
`;

const HeaderBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1140px;
  padding: 16px 0;
  align-items: center;
  margin: 0 auto;
`;

const StyledContent = styled.div`
  width: 100%;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
`;

const DimHeaderElement = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.text.header_dim};
  font-weight: 500;
  font-size: ${fonts.size.medium};
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
  margin-left: ${({ ml }) => (ml ? `${ml}px` : '')};
`;

const StyledLinkWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  right: -18px;
`;

const StyledLink = styled(NavLink).attrs({
  exact: true,
  activeStyle: { fontWeight: 'bold' }
})`
  position: absolute;
  right: ${({ r }) => (!isNaN(r) ? `${r}px` : '')};
  opacity: 0.9;
  padding: 5px 14px;
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  &:hover {
    background-color: #4a4b584d;
  }
`;

const Padding = styled.div`
  height: 25px;
`;

const NetworkNotification = styled.div`
  color: ${({ theme }) => theme.text.header_dim};
  align-self: center;
  font-weight: 500;
`;

const NoContent = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-top: 200px;
  display: flex;
  justify-content: center;
  margin-bottom: 350px;
  font-style: oblique;
`;

const BaseLayout = ({
  children,
  network,
  onboardingOpen,
  modalOpen,
  metamaskFetching,
  proposalsAvailable,
  accountsFetching,
  wrongNetwork,
  onboardingState,
  location
}) => {
  const childrenShouldMount =
    !metamaskFetching && proposalsAvailable && !wrongNetwork;
  const noContentMsg = wrongNetwork ? (
    'Please switch network to Kovan or Mainnet'
  ) : (
    <Loader
      size={20}
      mt={125}
      mb={200}
      color="header"
      background="background"
    />
  );
  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderBottom>
          <HeaderBottomContent>
            <div style={{ display: 'flex', paddingLeft: '2.5rem' }}>
              <NavLink
                style={{ color: 'white' }}
                to={{ pathname: '/', search: location.search }}
              >
                Governance
              </NavLink>
              <NetworkNotification style={{ marginLeft: '16px' }}>
                {childrenShouldMount && <NetworkIndicator network={network} />}
              </NetworkNotification>
            </div>
            <Flex>
              <StyledLinkWrapper>
                <StyledLink
                  to={{ pathname: '/', search: location.search }}
                  r={207}
                >
                  Executive
                </StyledLink>
                <StyledLink
                  to={{ pathname: '/polling', search: location.search }}
                  r={106}
                >
                  Polling
                </StyledLink>
                <StyledLink
                  to={{ pathname: '/modules', search: location.search }}
                  r={6}
                >
                  Modules
                </StyledLink>
              </StyledLinkWrapper>
              <DimHeaderElement
                onClick={() => {
                  mixpanel.track('btn-click', {
                    id: 'voting-contract',
                    product: 'governance-dashboard',
                    page: 'BaseLayout',
                    section: 'header'
                  });
                  if (
                    !accountsFetching &&
                    onboardingState !== OnboardingStates.FINISHED
                  )
                    onboardingOpen();
                  if (
                    !accountsFetching &&
                    onboardingState === OnboardingStates.FINISHED
                  )
                    modalOpen(SecureVoting);
                }}
                mr={50}
                ml={50}
              >
                Voting Contract
              </DimHeaderElement>
              <AccountBox fetching={!wrongNetwork && metamaskFetching} />
            </Flex>
          </HeaderBottomContent>
        </HeaderBottom>
      </StyledHeader>
      <AppWrapper>
        <StyledColumn>
          <StyledContent>
            {childrenShouldMount ? (
              children
            ) : (
              <NoContent>{noContentMsg}</NoContent>
            )}
          </StyledContent>
          <Padding />
        </StyledColumn>
      </AppWrapper>
      <Modals />
      <Toasts />
      <Footer />
      <Onboarding />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

const reduxProps = (
  { metamask, proposals, accounts, hat, onboarding },
  { location }
) => ({
  metamaskFetching: metamask.fetching,
  wrongNetwork: metamask.wrongNetwork,
  network: metamask.network,
  accountsFetching: accounts.fetching,
  proposalsAvailable: proposals.length > 0 && !hat.fetching,
  onboardingState: onboarding.state,
  location
});

export default withRouter(
  connect(
    reduxProps,
    { onboardingOpen, modalOpen }
  )(BaseLayout)
);
