import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getActiveAccount } from '../../reducers/accounts';
import { modalOpen, modalClose } from '../../reducers/modal';
import { cutMiddle, formatRound } from '../../utils/misc';
import { ethScanLink } from '../../utils/ethereum';
import ProxySetup from './ProxySetup';
import Lock from './Lock';
import theme from '../../theme';
import Withdraw from './Withdraw';
import BreakLink from './BreakLink';
import AccountBox from '../AccountBox';
import {
  StyledTitle,
  MkrAmt,
  FlexContainer,
  VoteImpactHeading,
  EndButton,
  Skip,
  FlexRowEnd,
  BoxLeft,
  BoxRight
} from './shared/styles';

const PaddedFlexContainer = styled(FlexContainer)`
  padding-top: 24px;
`;

const JustifiedFlexContainer = styled(FlexContainer)`
  justify-content: space-between;
`;

const LineSpacer = styled(FlexContainer)`
  margin-top: 13px;
  color: ${theme.text.dim_grey};
  font-size: 18px;
  color: #939393;
`;

export const BoxMiddle = styled.span`
  background-color: #f2f5fa;
  height: 68px;
  width: 270px;
  border-top: 1px solid #dfe1e3;
  border-right: 1px solid #dfe1e3;
  border-bottom: 1px solid #dfe1e3;
  padding: 12px;
`;

const SecureVoting = ({ modalOpen, modalClose, activeAccount, network }) => {
  if (activeAccount !== undefined && activeAccount.hasProxy) {
    const { linkedAccount } = activeAccount.proxy;
    const isColdWallet = activeAccount.proxyRole === 'cold';
    const coldWallet = isColdWallet ? activeAccount : linkedAccount;
    return (
      <Fragment>
        <JustifiedFlexContainer>
          <StyledTitle>Secure voting</StyledTitle>
          <AccountBox darkText={true} />
        </JustifiedFlexContainer>
        <PaddedFlexContainer>
          <BoxLeft>
            <VoteImpactHeading>Total MKR Balance</VoteImpactHeading>
            <MkrAmt>
              {formatRound(
                Number(coldWallet.mkrBalance) +
                  Number(activeAccount.proxy.votingPower),
                4
              )}
            </MkrAmt>
          </BoxLeft>
          <BoxMiddle>
            <VoteImpactHeading>In voting contract</VoteImpactHeading>
            <MkrAmt>{formatRound(activeAccount.proxy.votingPower, 4)}</MkrAmt>
          </BoxMiddle>
          <BoxRight>
            <VoteImpactHeading> LinkedAddress </VoteImpactHeading>
            <FlexContainer>
              <MkrAmt noSuffix> {cutMiddle(linkedAccount.address)} </MkrAmt>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={ethScanLink(linkedAccount.address, network)}
              >
                Etherscan
              </a>
            </FlexContainer>
          </BoxRight>
        </PaddedFlexContainer>
        <EndButton
          slim
          disabled={!isColdWallet}
          onClick={() => {
            modalOpen(Lock);
          }}
        >
          Top-up voting contract
        </EndButton>
        <FlexRowEnd>
          <Skip
            mr={10}
            mt={13}
            onClick={() => {
              modalOpen(BreakLink, {}, true);
            }}
          >
            Break wallet link
          </Skip>
          <LineSpacer> | </LineSpacer>
          <Skip ml={10} mr={0} mt={13} onClick={() => modalOpen(Withdraw)}>
            Withdraw from voting contract
          </Skip>
        </FlexRowEnd>
      </Fragment>
    );
  } else return <ProxySetup />;
};

export default connect(
  state => ({
    activeAccount: getActiveAccount(state),
    network: state.metamask.network
  }),
  { modalOpen, modalClose }
)(SecureVoting);
