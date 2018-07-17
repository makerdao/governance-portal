import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { colors, fonts } from '../theme';
import Modals from '../components/modals';
// import Footer from "../components/Footer";
import Loader from '../components/Loader';
import AccountBox from '../components/AccountBox';
import logo from '../imgs/logo.svg';

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
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
  height: 148px;
  display: block;
  align-items: center;
  background-color: rgb(${colors.header});
  color: rgb(${colors.white});
`;

const HeaderTop = styled.div`
  width: 100%;
  height: 83px;

  padding: 0px 16px;
`;

const HeaderTopContent = styled.div`
  max-width: 1140px;
  width: 100%;
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0px auto;
  height: 100%;
`;

const HeaderBottom = styled.div`
  height: 64px;
  width: 100%;
  padding: 0px 16px;
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

const StyledTitle = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.large};
  margin-left: 12px;
`;

const HeaderBottomLeft = styled.div`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
`;

const MakerLinks = styled.div``;

const StyledAnchor = styled.a`
  color: rgb(${colors.white});
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.medium};
  margin: 0px 49px;
  margin-right: ${({ edge }) => (!!edge && edge === 'right' ? '0px' : '')};
  margin-left: ${({ edge }) => (!!edge && edge === 'left' ? '0px' : '')};
`;

const StyledContent = styled.div`
  width: 100%;
`;

const StyledLogo = styled.div`
  height: 36px;
  width: 36px;
  cursor: pointer;
  background: url(${logo}) no-repeat;
  margin-top: 10px;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
`;

const Padding = styled.div`
  height: 100px;
`;

const BorderLine = styled.div`
  height: 1px;
  background-color: #445162;
`;

const BaseLayout = ({
  children,
  web3Available,
  metamaskFetching,
  topicsAvailable
}) => {
  const childrenShouldMount = !metamaskFetching && topicsAvailable;
  return (
    <StyledLayout>
      <StyledHeader>
        <HeaderTop>
          <HeaderTopContent>
            <StyledLink to="/">
              <StyledLogo />
              <StyledTitle>MAKER</StyledTitle>
            </StyledLink>
            <MakerLinks>
              <StyledAnchor href="/" target="_blank" edge={'left'}>
                Products
              </StyledAnchor>
              <StyledAnchor
                href="https://makerdao.com/whitepaper/"
                target="_blank"
              >
                Learn
              </StyledAnchor>
              <StyledAnchor href="https://makerdao.com" target="_blank">
                Company
              </StyledAnchor>
              <StyledAnchor
                href="https://chat.makerdao.com/channel/collateral-discuss"
                target="_blank"
                edge={'right'}
              >
                Community
              </StyledAnchor>
            </MakerLinks>
          </HeaderTopContent>
        </HeaderTop>
        <BorderLine />
        <HeaderBottom>
          <HeaderBottomContent>
            <StyledLink to="/">
              <HeaderBottomLeft>Governance</HeaderBottomLeft>
            </StyledLink>
            <AccountBox
              web3Available={web3Available}
              fetching={metamaskFetching}
            />
          </HeaderBottomContent>
        </HeaderBottom>
      </StyledHeader>
      <AppWrapper>
        <StyledColumn>
          <StyledContent>
            {childrenShouldMount ? (
              children
            ) : (
              <div style={{ marginTop: '150px' }}>
                <Loader size={20} color="header" background="background" />
              </div>
            )}
          </StyledContent>
          {/* <Footer /> */}
          <Padding />
        </StyledColumn>
      </AppWrapper>
      <Modals />
    </StyledLayout>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired,
  web3Available: PropTypes.bool
};

const reduxProps = ({ metamask, topics }) => ({
  web3Available: metamask.web3Available,
  metamaskFetching: metamask.fetching,
  topicsAvailable: topics.length > 0
});

export default withRouter(connect(reduxProps)(BaseLayout));
