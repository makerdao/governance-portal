import styled from 'styled-components';

export const Banner = styled.div`
  height: 82px;
  background: #fdede8;
  border: 1px solid #f77249;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 31px 0px;
  text-align: left;
  padding: 16px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

export const BannerHeader = styled.div`
  font-size: 20px;
  color: #1f2c3c;
  font-weight: bold;
`;

export const BannerBody = styled.div`
  white-space: pre;
  font-size: 15px;
  color: #546978;
  display: flex;
`;

export const BannerContent = styled.div`
  margin-right: 8px;
`;
