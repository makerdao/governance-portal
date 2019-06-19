import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import closeImg from '../imgs/close-inline.svg';
import theme from '../theme';
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
`;

const SectionText = styled.p`
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
  margin-bottom: 20px;
`;

const StyledBody = styled.p`
  width: 150px;
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
`;

const OptionText = styled.p`
  text-align: left;
  line-height: 30px;
  font-size: 17px;
  color: #546978;
`;

const VoteOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const CloseIcon = styled.p`
  width: 15px;
  height: 15px;
  background-color: red;
  mask: url(${closeImg}) center no-repeat;
  cursor: pointer;
`;

const Code = styled.pre`
  font-size: 14px;
  padding: 30px;
`;

const ABSTAIN = 'Abstain';
const NOCHANGE = 'No Change';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pollTitle: '',
      pollSummary: '',
      pollStart: null,
      pollEnd: null,
      pollLink: '',
      pollOption: '',
      pollOptions: [ABSTAIN, NOCHANGE],
      pollContent: '',
      pollMarkdown: '',
      pollGenerated: false
    };
  }

  handlePollState = (e, k) => {
    e.stopPropagation();
    this.setState({
      ...this.state,
      [k]: e.target.value
    });
  };

  addPollVoteOption = () => {
    if (this.state.pollOption.length) {
      const opt = this.state.pollOption;
      const opts = this.state.pollOptions;
      this.setState({
        pollOption: '',
        pollOptions: [...opts, opt]
      });
    }
  };

  removePollOption = idx => {
    const opts = this.state.pollOptions.filter((item, index) => index !== idx);
    this.setState({
      pollOptions: opts
    });
  };

  resetPollState = () => {
    this.setState({
      pollTitle: '',
      pollSummary: '',
      pollLink: '',
      pollOption: '',
      pollOptions: [ABSTAIN, NOCHANGE],
      pollContent: ''
    });
  };

  parseFormToMarkdownString = () => {
    const optsString = this.state.pollOptions.reduce(
      (acc, opt, idx) => `${acc}   ${idx}: ${opt}\n`,
      ''
    );
    const yml = `---\ntitle: ${this.state.pollTitle}\nsummary: ${
      this.state.pollSummary
    }\ndiscussion_link: ${this.state.pollLink}\noptions:\n${optsString}---\n`;
    const md = `# Poll: ${this.state.pollTitle}\n\n${this.state.pollContent}`;
    this.setState({
      pollMarkdown: `${yml}${md}`,
      pollGenerated: true
    });
  };

  render = () => {
    const isValidSubmission =
      !!this.state.pollTitle &&
      !!this.state.pollSummary &&
      this.state.pollOptions.length > 2 &&
      !!this.state.pollContent;
    // this.pollStart &&
    // this.pollEnd &&

    return (
      <Fragment>
        {this.state.pollGenerated ? (
          <RiseUp>
            <StyledTop>
              <StyledTitle>Create a new Polling proposal</StyledTitle>
            </StyledTop>
            <ContentWrapper>
              <Code>{this.state.pollMarkdown}</Code>
              <SectionWrapper>
                <Button
                  slim
                  onClick={() =>
                    navigator.clipboard.writeText(this.state.pollMarkdown)
                  }
                >
                  Copy
                </Button>
                &nbsp;
                <Button
                  slim
                  color="grey"
                  hoverColor="grey"
                  onClick={() => this.setState({ pollGenerated: false })}
                >
                  Back
                </Button>
              </SectionWrapper>
            </ContentWrapper>
          </RiseUp>
        ) : (
          <RiseUp>
            <StyledTop>
              <StyledTitle>Create a new Polling proposal</StyledTitle>
            </StyledTop>
            <ContentWrapper>
              <SectionTitle>Poll Details</SectionTitle>
              <SectionText>
                This form will generate a formatted markdown file which can be
                copied and included in the cms
              </SectionText>
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
                <StyledBody>Poll Start Time:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Date and Time for the Poll to open"
                  value={this.state.pollStart}
                  onChange={e => this.handlePollState(e, 'pollStart')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll End Time:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Date and Time for the Poll to close"
                  value={this.state.pollEnd}
                  onChange={e => this.handlePollState(e, 'pollEnd')}
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
                <StyledBody>Vote Options:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Add possible voting options"
                  value={this.state.pollOption}
                  onChange={e => this.handlePollState(e, 'pollOption')}
                  maxLength={25}
                />
                <Button
                  css={{ alignSelf: 'center', marginLeft: '10px' }}
                  width="190px"
                  onClick={this.addPollVoteOption}
                >
                  Add Option
                </Button>
              </SectionWrapper>

              <SectionWrapper>
                <div css={{ width: '215px' }} />
                <VoteOptionsGrid>
                  {this.state.pollOptions.map((opt, idx) => (
                    <Card
                      key={idx}
                      css={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '325px',
                        padding: '10px'
                      }}
                    >
                      <OptionText>
                        #{idx} - {opt}
                      </OptionText>
                      {idx > 1 && (
                        <CloseIcon onClick={() => this.removePollOption(idx)} />
                      )}
                    </Card>
                  ))}
                </VoteOptionsGrid>
              </SectionWrapper>

              <SectionWrapper>
                <Button
                  slim
                  disabled={!isValidSubmission}
                  onClick={this.parseFormToMarkdownString}
                >
                  Submit
                </Button>
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
        )}
      </Fragment>
    );
  };
}

export default Admin;
