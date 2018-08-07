import React, { Fragment } from 'react';
import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import Button from '../../Button';
import styled from 'styled-components';
import theme from '../../../theme';

const BoxHalfLeft = styled.span`
  background-color: #f2f5fa;
  height: 68px;
  width: 269px;
  border: 1px solid #dfe1e3;
  border-radius: 4px 0px 0px 4px;
  float: left;
`;

const BoxHalfRight = styled.span`
  background-color: #f2f5fa;
  height: 68px;
  width: 269px;
  border: 1px solid #dfe1e3;
  border-radius: 0px 4px 4px 0px;
  float: right;
`;

const BoxTitle = styled.div`
  font-size: 14px;
  color: ${theme.text.dim_grey_alt};
  line-height: 22pm;
  height: 50%;
`;

const BoxText = styled.div`
  font-size: 16px;
  color: #212536;
  line-height: 24pm;
  height: 50%;
`;

const MkrText = styled.span`
  font-size: 16px;
  color: ${theme.text.dim_grey};
  line-height: 24pm;
  height 50%;
`;

export default ({ modalClose, sendMkrAmount, postLinkUpdate }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Secure voting contract setup</StyledTitle>
    </StyledTop>
    <StyledBlurb>
      Your secure voting contract has been successfully set up. You can now vote
      using your hot wallet below. You can manage your secure voting contract by
      clicking Secure voting on the governance dashboard
    </StyledBlurb>
    <BoxHalfLeft>
      <BoxTitle>Your hot wallet</BoxTitle>
      <BoxText> 0x...aweferf </BoxText>
    </BoxHalfLeft>
    <BoxHalfRight>
      <BoxTitle>Locked in voting contract:</BoxTitle>
      <BoxText>
        {sendMkrAmount} <MkrText>MKR</MkrText>{' '}
      </BoxText>
    </BoxHalfRight>
    <div
      style={{
        alignSelf: 'center',
        marginTop: '18px'
      }}
    >
      <Button
        slim
        onClick={() => {
          postLinkUpdate();
          modalClose();
        }}
      >
        Finish and close
      </Button>
    </div>
  </Fragment>
);
