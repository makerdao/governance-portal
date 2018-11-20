import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Header, Footer } from '@makerdao/ui-components';
import { colors, fonts } from '../theme';
import { firstLetterCapital } from '../utils/misc';
import { modalOpen } from '../reducers/modal';
import Modals from '../components/modals';
import SecureVoting from '../components/modals/SecureVoting';
import Loader from '../components/Loader';
import AccountBox from '../components/AccountBox';
import Toasts from '../components/Toasts';
import play from '../imgs/play.svg';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-width: 1000px;
`;
const AppWrapper = styled.div`
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
`;

const DimHeaderLink = styled.a`
  cursor: pointer;
  color: ${({ theme }) => theme.text.header_dim};
  font-weight: 500;
  font-size: ${fonts.size.medium};
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
`;

const StyledLink = styled(NavLink).attrs({
  exact: true,
  activeStyle: { fontWeight: 'bold' }
})`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
`;

const Padding = styled.div`
  height: 25px;
`;

const BorderLine = styled.div`
  height: 1px;
  background-color: #445162;
`;

const NetworkNotification = styled.div`
  color: ${({ theme }) => theme.text.header_dim};
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

const PlayBtn = styled.div`
  background: url(${play}) no-repeat;
  width: 19px;
  height: 19px;
  margin-right: 6px;
`;

const Circle = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${({ network }) =>
    network === 'kovan' ? '#9055AF' : '#30bd9f'};
  border-radius: 50%;
  display: inline-block;
  margin-right: 4px;
`;

const BaseLayout = ({
  children,
  network,
  modalOpen,
  metamaskFetching,
  topicsAvailable,
  accountsFetching,
  wrongNetwork
}) => {
  const childrenShouldMount =
    !metamaskFetching && topicsAvailable && !wrongNetwork;
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
        <Header />
        <BorderLine />
        <HeaderBottom>
          <HeaderBottomContent>
            <div style={{ display: 'flex' }}>
              <StyledLink to="/">Executive</StyledLink>
              <StyledLink to="/signaling" style={{ marginLeft: '16px' }}>
                Signaling
              </StyledLink>
              <NetworkNotification style={{ marginLeft: '16px' }}>
                {childrenShouldMount && (
                  <React.Fragment>
                    <Circle network={network} />
                    {firstLetterCapital(network)}
                  </React.Fragment>
                )}
              </NetworkNotification>
            </div>
            {/* cheap network notification, probably to be replaced */}
            <Flex style={{ zIndex: '100' }}>
              <DimHeaderLink
                href="https://www.youtube.com/watch?v=wP7DedWcEmg"
                target="_blank"
                rel="noopener noreferrer"
                mr={50}
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <PlayBtn />
                Watch intro video
              </DimHeaderLink>
              <DimHeaderElement
                onClick={() => {
                  if (!accountsFetching) modalOpen(SecureVoting);
                }}
                mr={50}
              >
                Personal Voting Contract
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
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

const reduxProps = ({ metamask, topics, accounts }) => ({
  metamaskFetching: metamask.fetching,
  wrongNetwork: metamask.wrongNetwork,
  network: metamask.network,
  accountsFetching: accounts.fetching,
  topicsAvailable: topics.length > 0
});

export default withRouter(
  connect(
    reduxProps,
    { modalOpen }
  )(BaseLayout)
);
