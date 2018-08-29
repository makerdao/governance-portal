import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import Header from '@makerdao/ui-components/dist/components/header';
import Footer from '@makerdao/ui-components/dist/components/footer';
import { colors, fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import Modals from '../components/modals';
import SecureVoting from '../components/modals/SecureVoting';
import Loader from '../components/Loader';
import AccountBox from '../components/AccountBox';
import Toasts from '../components/Toasts';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
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
  padding: 16px 16px;
  min-height: 66px;
`;

const HeaderBottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  max-width: 1140px;
  align-items: center;
  margin: 0px auto;
`;

const HeaderBottomLeft = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
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

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
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
            <StyledLink to="/">
              <HeaderBottomLeft>Governance</HeaderBottomLeft>
            </StyledLink>
            {/* cheap network notification, probably to be replaced */}
            <NetworkNotification>
              {childrenShouldMount && `${network}`}
            </NetworkNotification>
            <Flex style={{ zIndex: '100' }}>
              <DimHeaderElement
                onClick={() => {
                  if (!accountsFetching) modalOpen(SecureVoting);
                }}
                mr={50}
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
              <div
                style={{
                  marginTop: '150px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {noContentMsg}
              </div>
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
