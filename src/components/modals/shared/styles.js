import styled from 'styled-components';

export const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTitle = styled.div`
  font-weight: bold;
  color: #212536;
  line-height: 22px;
  font-size: 28px;
`;

export const StyledBlurb = styled.p`
  line-height: 22px;
  font-size: 17px;
  color: #868997;
  margin: 22px 0px 16px 0px;
`;

export const StyledTop = styled.div`
  display: flex;
  justify-content: center;
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
  border-bottom: 1px dashed ${({ blue }) =>
    blue ? '#2F80ED' : '#868997'}; #868997;
`;

export const CircledNum = styled.div`
  border-radius: 50%;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  background: ${({ dim }) => (dim ? '#D1D8DA' : '#30bd9f')};
  color: #fff;
  text-align: center;
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : '17px')};
  padding: ${({ p }) => (p ? `${p}px` : '3px')};
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
  height: 210px;
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

export const GuideInfo = styled.p`
  font-size: 15px;
  color: #868997;
`;

export const SetupLater = styled.p`
  font-size: 16px;
  text-align: center;
  color: #868997;
  cursor: pointer;
  margin-top: 18px;
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
  color: #868997;
`;

export const InfoBoxContent = styled.div``;

export const ProgressTabsWrapper = styled.div`
  height: 44px;
  display: flex;
  background: #f6f8f9;
  border-radius: 4px 4px 0px 0px;
  margin-top: -30px;
  margin-bottom: 20px;
  margin-right: -26px;
  margin-left: -26px;
  border-bottom: 1px solid #d3dadc;
`;

export const TabsTitle = styled.p`
  font-size: 14px;
  color: #868997;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
`;

export const TabsTitleWrapper = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: ${({ borderRight }) =>
    borderRight ? '1px solid #D3DADC' : ''};
`;

export const TxHash = styled.a`
  padding: 6px;
  padding-top: 20px;
  font-size: 14px;
`;

export const Styledinput = styled.input`
  background: #f6f8f9;
  height: 40px;
  margin: 0px 30px;
  margin-top: 14px;
  color: #868997;
  padding: 10px;
  font-size: 16px;
`;

export const Note = styled.p`
  width: 75%;
  margin: auto;
  font-style: oblique;
  opacity: 0.5;
`;
