import React, { Fragment } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  MkrAmt,
  FlexContainer,
  VoteImpactHeading,
  BoxLeft,
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
