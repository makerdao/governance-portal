import React, { Fragment } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  MkrAmt,
  FlexContainer,
  VoteImpactHeading,
  BoxLeft,
  TooltipCard,
  BoxRight
} from '../shared/styles';
import Button from '../../Button';
import styled from 'styled-components';
import { cutMiddle, formatRound } from '../../../utils/misc';

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-self: center;
  margin-top: 18px;
`;

export default ({ modalClose, sendMkrAmount, hotAccount }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Voting contract setup</StyledTitle>
    </StyledTop>
    <StyledBlurb>
      Your voting contract has been successfully set up. You can now vote using
      your{' '}
      <TooltipCard
        link="https://google.com"
        body="his the wallet you vote with. This account will never be able to withdraw your tokens to itself."
        title="Hot Wallet"
      >
        hot wallet
      </TooltipCard>{' '}
      below. You can manage your voting contract by clicking Voting Contract on
      the governance dashboard
    </StyledBlurb>
    <FlexContainer>
      <BoxLeft>
        <VoteImpactHeading>Your hot wallet</VoteImpactHeading>
        <MkrAmt noSuffix> {cutMiddle(hotAccount.address, 12, 12)} </MkrAmt>
      </BoxLeft>
      <BoxRight>
        <VoteImpactHeading>Locked in voting contract:</VoteImpactHeading>
        <MkrAmt>{formatRound(sendMkrAmount, 5)}</MkrAmt>
      </BoxRight>
    </FlexContainer>
    <ButtonContainer>
      <Button
        slim
        onClick={() => {
          modalClose();
        }}
      >
        Finish and close
      </Button>
    </ButtonContainer>
  </Fragment>
);
