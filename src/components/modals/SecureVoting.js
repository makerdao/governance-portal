import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { getActiveAccount } from '../../reducers/accounts';
import { modalOpen } from '../../reducers/modal';
import { cutMiddle, formatRound } from '../../utils/misc';
import { ethScanLink } from '../../utils/ethereum';
import ProxySetup from './ProxySetup';
import theme from '../../theme';
import Button from '../Button';
import Lock from './Lock';
import Withdraw from './Withdraw';
import {
  StyledTitle,
  StyledTop,
  MkrAmt,
  FlexContainer,
  VoteImpactHeading,
  EndButton,
  Skip,
  FlexRowEnd
} from './shared/styles';
import { BoxLeft, BoxRight } from './ProxySetup/Summary';

const PaddedFlexContainer = FlexContainer.extend`
  padding-top: 24px;
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

const SecureVoting = ({ modalOpen, activeAccount, network }) => {
  const networkShown = network === 'kovan' ? 'kovan' : 'mainnet';
  const { linkedAccount } = activeAccount.proxy;
  const isColdWallet = activeAccount.proxyRole === 'cold';
  const coldWallet = isColdWallet ? activeAccount : linkedAccount;
  if (activeAccount !== undefined && activeAccount.hasProxy) {
    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Secure voting</StyledTitle>
        </StyledTop>
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
                href={ethScanLink(linkedAccount.address, networkShown)}
              >
                Etherscan
              </a>
            </FlexContainer>
          </BoxRight>
        </PaddedFlexContainer>
        <FlexRowEnd>
          <Skip mr={24} mt={24} onClick={() => modalOpen(Withdraw)}>
            - Withdraw from voting contract
          </Skip>
          <EndButton
            slim
            onClick={() => {
              modalOpen(Lock);
            }}
          >
            + Top-up voting contract
          </EndButton>
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
  { modalOpen }
)(SecureVoting);
