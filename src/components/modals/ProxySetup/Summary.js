import React, { Fragment } from 'react';
import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import Button from '../../Button';
import styled from 'styled-components';

const BoxHalfLeft = styled.div`
  background-color: #f2f5fa;
  height: 68px;
  width: 269px;
  border: 1px solid #dfe1e3;
  border-radius: 4px 0px 0px 4px;
  display: inline-block;
`;

const BoxHalfRight = styled.div`
  background-color: #f2f5fa;
  height: 68px;
  width: 269px;
  border: 1px solid #dfe1e3;
  border-radius: 0px 4px 4px 0px;
  display: inline-block;
`;

const VerticalLine = styled.div`
  width: 1px; /* Line width */
  background-color: #dfe1e3; /* Line color */
  height: 68px;
  display: inline-block;
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
    <BoxHalfLeft>Your Hot Wallet</BoxHalfLeft>
    <VerticalLine />
    <BoxHalfRight>Locked in voting contract: {sendMkrAmount} MKR</BoxHalfRight>
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
