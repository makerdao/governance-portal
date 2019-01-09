import React from 'react';
import styled from 'styled-components';

import flag from '../imgs/flag.svg';
import theme from '../theme';

export const Banner = styled.div`
  height: 82px;
  background: #ffffff;
  border: 1px solid #f77249;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 20px 0px 24px;
  text-align: left;
  padding: 16px 25px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`;

const FlagIcon = styled.p`
  margin-left: 17px;
  margin-top: 16px;
  width: 22px;
  height: 22px;
  background-color: #fff;
  mask: url(${flag}) center no-repeat;
`;

const Circle = styled.div`
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: #f85d2d;
`;
export const Flag = props => (
  <Circle {...props}>
    <FlagIcon />
  </Circle>
);

export const BannerHeader = styled.div`
  font-size: 20px;
  color: ${theme.text.darker_default};
  font-weight: bold;
  line-height: 1.1em;
  margin-bottom: 0.2em;
`;

export const BannerBody = styled.div`
  white-space: pre;
  font-size: 15px;
  color: #546978;
  display: flex;
  flex-direction: column;
`;

export const BannerContent = styled.div`
  margin-right: 8px;
`;
