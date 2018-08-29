import React from 'react';
import styled from 'styled-components';

import external from '../../../imgs/external.svg';
import theme from '../../../theme';
import Button from '../../Button';

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledBlurb = styled.div`
  line-height: 22px;
  font-size: 17px;
  color: ${theme.text.dim_grey_alt};
  margin: 22px 0px 16px 0px;
`;

export const StyledTop = styled.div`
  display: flex;
  justify-content: center;
`;

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

export const Column = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? '100%' : 'auto')};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? 'center' : 'flex-start')};
`;

export const StyledAnchor = styled.a`
  color: ${({ blue }) => (blue ? '#3080ed' : '#212536')};
  margin-bottom: -3px;
  border-bottom: 1px dashed
    ${({ blue }) => (blue ? '#2F80ED' : theme.text.dim_grey_alt)};
`;

export const CircledNum = styled.div`
  border-radius: 50%;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background: ${({ dim }) => (dim ? '#D1D8DA' : '#30bd9f')};
  color: #fff;
  text-align: center;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '17px')};
  padding: ${({ p }) => (p ? `${p}px` : '4px 12px')};
  padding-left: ${({ p }) => (p ? `` : '11px')};
`;

export const Section = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  margin-bottom: 22px;
`;

export const GuideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  margin: 0px 20px;
  height: 240px;
  justify-content: space-between;
`;

export const Guide = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

export const GuideTitle = styled.p`
  font-size: 20px;
  color: #212536;
`;

export const GuideInfo = styled.div`
  white-space: nowrap;
  font-size: 15px;
  color: ${theme.text.dim_grey_alt};
`;

export const Skip = styled.p`
  font-size: ;
  text-align: center;
  color: ${theme.text.dim_grey_alt};
  cursor: pointer;
  margin-right: ${({ mr }) => (mr ? `${mr}px` : '')};
  margin-left: ${({ ml }) => (ml ? `${ml}px` : '')};
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
`;

export const FlexRowEnd = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const InfoBox = styled.div`
  display: flex;
  border: 1px solid #dfe1e3;
  box-sizing: border-box;
  border-radius: 4px;
  background: #f2f5fa;
  height: ${({ height }) => (height ? `${height}px` : '68px')};
`;

export const InfoBoxSection = styled.div`
  width: 100%;
  padding: 12px;
`;

export const InfoBoxHeading = styled.div`
  line-height: 26px;
  font-size: 14px;
  color: ${theme.text.dim_grey_alt};
`;

export const TxHash = styled.a`
  padding: 6px;
  padding-top: 20px;
  font-size: 14px;
`;

const Input = styled.input`
  border: 0;
  padding: 0;
  height: 40px;
  font-size: 16px;
`;

const WrappedInput = props => {
  return <Input {...props} />;
};

export const StyledInput = styled(WrappedInput)`
  border: 1px solid #d1d8da;
  color: ${theme.text.dim_grey_alt};
  padding: 10px;
  border-radius: 4px;
  display: block;
`;

export const Note = styled.p`
  font-size: 14px;
  opacity: 0.5;
  align-self: flex-start;
  margin-left: 10px;
`;

export const InputLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 26px;
`;

export const ValueLabel = styled.span`
  color: ${theme.text.dim_grey_alt};
`;

export const EndButton = styled(Button)`
  align-self: flex-end;
  margin-top: 24px;
  width: auto;
`;

export const GreyLink = styled.a`
  color: ${theme.text.dim_grey_alt};
`;

export const MkrAmt = styled.p`
  color: #212536;
  font-size: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:after {
    content: ${({ noSuffix }) => (noSuffix ? "''" : "'MKR'")};
    color: #939393;
    margin-left: 4px;
  }
`;

export const VoteImpact = styled.div`
  display: flex;
  overflow: hidden;
  background-color: #fdfdfd;
  border-radius: 4px;
  border: solid 1px #dfe1e3;
`;

export const IntroTxBox = styled.div`
  display: flex;
  background-color: #ececec;
  color: ${theme.text.dim_grey_alt};
  border-radius: 4px;
  padding: 10px;
  margin: 0px 20px;
  width: calc(100% - 40px);
`;

export const Bold = styled.strong`
  color: #212536;
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
`;

export const Dim = styled.strong`
  opacity: 0.5;
`;

export const Oblique = styled.strong`
  font-style: oblique;
`;

export const VoteImpactHeading = styled.p`
  color: ${theme.text.dim_grey_alt};
  font-size: 14px;
  white-space: nowrap;
`;

const TooltipWrapper = styled.div`
  white-space: pre-wrap;
  cursor: default;
  border-radius: 4px;
  text-transform: none;
  border: 1px solid #e0e0e0;
  box-shadow: 0px 1px 3px rgba(190, 190, 190, 0.25);
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  min-width: 360px;
  background-color: ${({ theme }) => theme.generic.white};
  padding: 16px;
  background: ${({ theme }) => theme.generic.white};
  color: ${({ theme }) => theme.text.default};
`;

const TooltipTitle = styled.div`
  margin-bottom: 10px;
  line-height: normal;
  font-size: 16px;
  color: #252525;
`;
const TooltipBody = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.generic.black};
  margin-bottom: 4px;
`;
const TooltipLink = styled.a`
  color: ${({ theme }) => theme.brand.default};
  font-size: 14px;
  &:after {
    content: '';
    width: 30px;
    height: 9px;
    margin-left: 5px;
    display: inline-block;
    background: url(${external}) center no-repeat;
  }
`;

const HoverTarget = styled.div`
  user-select: none;
  pointer-events: none;
  transition: all 0.25s ease-out;
  cursor: pointer;
  opacity: 0;
  min-width: 300px;
  top: 8px;
  left: 0;
  position: absolute;
  z-index: 1;
  &:hover {
    opacity: 1;
    user-select: auto;
    pointer-events: auto;
    transform: translateY(10px);
  }
`;

const StyledInline = styled.div`
  cursor: pointer;
  color: ${({ theme }) => theme.text.dark_link};
  margin-bottom: -3px;
  border-bottom: 1px dashed ${({ theme }) => theme.brand.default};
  display: inline;
  // @media (max-width: 768px) {
  //   &:hover {}
  &:hover ~ div {
    opacity: 1;
    user-select: auto;
    pointer-events: auto;
    transform: translateY(10px);
  }
`;

export const TooltipCard = ({ link, body, title, children }) => (
  <div style={{ display: 'inline-block', position: 'relative' }}>
    <StyledInline>{children}</StyledInline>
    <HoverTarget>
      <TooltipWrapper>
        <TooltipTitle>{title}</TooltipTitle>
        <TooltipBody>{body}</TooltipBody>
        <TooltipLink href={link} rel="noopener noreferrer" target="_blank">
          Read more
        </TooltipLink>
      </TooltipWrapper>
    </HoverTarget>
  </div>
);
