import React, { Fragment } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  MkrAmt,
  FlexContainer,
  VoteImpactHeading
} from '../shared/styles';
import Button from '../../Button';
import styled from 'styled-components';
import { cutMiddle, formatRound } from '../../../utils/misc';

export const BoxLeft = styled.span`
  background-color: #f2f5fa;
  height: 68px;
  width: 100%;
  border: 1px solid #dfe1e3;
  border-radius: 4px 0px 0px 4px;
  padding: 12px;
`;

export const BoxRight = styled.span`
  background-color: #f2f5fa;
  height: 68px;
  width: 100%;
  border-top: 1px solid #dfe1e3;
  border-right: 1px solid #dfe1e3;
  border-bottom: 1px solid #dfe1e3;
  border-radius: 0px 4px 4px 0px;
  float: right;
  padding: 12px;
`;

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
      <StyledTitle>Secure voting contract setup</StyledTitle>
    </StyledTop>
    <StyledBlurb>
      Your secure voting contract has been successfully set up. You can now vote
      using your hot wallet below. You can manage your secure voting contract by
      clicking Secure voting on the governance dashboard
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
