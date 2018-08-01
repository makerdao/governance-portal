import styled from 'styled-components';
import theme from '../theme';

export const Banner = styled.div`
  height: 82px;
  background: #fdede8;
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

export const BannerButton = styled.a`
  border: 1px solid ${theme.text.darker_default};
  border-radius: 4px;
  display: flex;
  align-items: center;
  align-self: center;
  padding: 0 20px;
  color: ${theme.text.darker_default};
  height: 46px;
`;
