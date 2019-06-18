import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import theme, { colors } from '../theme';
import { TextArea, Input } from '@makerdao/ui-components-core';
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
  constructor(props) {
    super(props);

    this.state = {
      pollTitle: '',
      pollSummary: '',
      pollLink: '',
      pollOption: '',
      pollOptions: [],
      pollContent: ''
    };
  }

  handlePollState = (e, k) => {
    e.stopPropagation();
    this.setState({
      ...this.state,
      [k]: e.target.value
    });
  };

  resetPollState = () => {
    this.setState({
      pollTitle: '',
      pollSummary: '',
      pollLink: '',
      pollOption: '',
      pollOptions: [],
      pollContent: ''
    });
  };

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
            <Input
              width="400px"
              placeholder="This will be the poll title"
              value={this.state.pollTitle}
              onChange={e => this.handlePollState(e, 'pollTitle')}
            />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Summary:</StyledBody>
            <Input
              width="400px"
              placeholder="Give a short description of what this Poll is for"
              value={this.state.pollSummary}
              onChange={e => this.handlePollState(e, 'pollSummary')}
            />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Discussion Link:</StyledBody>
            <Input
              width="400px"
              placeholder="Link to where this Polling proposal will be discussed"
              value={this.state.pollLink}
              onChange={e => this.handlePollState(e, 'pollLink')}
            />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Vote Options:</StyledBody>
            <Input
              width="400px"
              placeholder="Add the possible voting options"
              value={this.state.pollOption}
              onChange={e => this.handlePollState(e, 'pollOption')}
            />
          </SectionWrapper>

          <SectionWrapper>
            <StyledBody>Proposal:</StyledBody>
            <TextArea
              width="600px"
              height="400px"
              placeholder="Write (in markdown) the full polling proposal"
              value={this.state.pollContent}
              onChange={e => this.handlePollState(e, 'pollContent')}
            />
          </SectionWrapper>

          <SectionWrapper>
            <Button slim>Submit</Button>
            &nbsp;
            <Button
              slim
              color="grey"
              hoverColor="grey"
              onClick={this.resetPollState}
            >
              Reset
            </Button>
          </SectionWrapper>
        </ContentWrapper>
      </RiseUp>
    );
  };
}

export default Admin;
