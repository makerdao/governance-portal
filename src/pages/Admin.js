import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import theme, { colors } from '../theme';

const riseUp = keyframes`
0% {
  opacity: 0;
  transform: translateY(15px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

const StyledTop = styled.div`
  padding: 54px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1140px;
  margin: auto;
`;

const StyledTitle = styled.p`
  font-size: 28px;
  color: ${theme.text.darker_default};
  line-height: normal;
  font-weight: 500;
`;

const RiseUp = styled.div`
  animation: ${riseUp} 0.75s ease-in-out;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const RightPanels = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 400px;
`;

const ProposalPanel = styled(Card)`
  max-width: 650px;
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

class Admin extends Component {
  render = () => {
    return (
      <RiseUp>
        <StyledTop>
          <StyledTitle>Create Polling Proposal</StyledTitle>
        </StyledTop>
        <ContentWrapper>
          <ProposalPanel>Full proposal goes here</ProposalPanel>
          <RightPanels>Other input goes here</RightPanels>
        </ContentWrapper>
      </RiseUp>
    );
  };
}

export default Admin;
