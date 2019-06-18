import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import Input from '../components/Input';
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

const ContentWrapper = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 100px;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 40px;
`;

const SectionTitle = styled.p`
  font-size: 22px;
  color: ${theme.text.darker_default};
  line-height: normal;
  font-weight: 500;
  margin-bottom: 30px;
`;

const StyledBody = styled.p`
  width: 150px;
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
`;

class Admin extends Component {
  render = () => {
    return (
      <RiseUp>
        <StyledTop>
          <StyledTitle>Create a new Polling proposal</StyledTitle>
        </StyledTop>
        <ContentWrapper>
          <SectionTitle>Poll Details</SectionTitle>

          <SectionWrapper>
            <StyledBody>Title:</StyledBody>
            <Input />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Summary:</StyledBody>
            <Input />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Discussion Link:</StyledBody>
            <Input />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Vote Options:</StyledBody>
            <Input />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Proposal:</StyledBody>
            <Input />
          </SectionWrapper>
        </ContentWrapper>
      </RiseUp>
    );
  };
}

export default Admin;
