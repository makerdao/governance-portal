import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import closeImg from '../imgs/close-inline.svg';
import theme from '../theme';
import { TextArea, Input } from '@makerdao/ui-components-core';
import { copyToClipboard } from '../utils/misc';
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
  border: 1px solid black;
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
      pollRules: '',
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
    }\ndiscussion_link: ${this.state.pollLink}\nrules: ${
      this.state.pollRules
    }\noptions:\n${optsString}---\n`;
    const md = `# Poll: ${this.state.pollTitle}\n\n${this.state.pollContent}`;
    this.setState({
      pollMarkdown: `${yml}${md}`,
      pollGenerated: true
    });
  };

  render = () => {
    const {
      pollTitle,
      pollSummary,
      pollStart,
      pollEnd,
      pollLink,
      pollRules,
      pollOption,
      pollOptions,
      pollMarkdown,
      pollContent,
      pollGenerated
    } = this.state;
    const isValidSubmission =
      !!pollTitle && !!pollSummary && pollOptions.length > 2 && !!pollContent;

    return (
      <Fragment>
        {pollGenerated ? (
          <RiseUp>
            <StyledTop>
              <StyledTitle>Create a new Polling proposal</StyledTitle>
            </StyledTop>
            <ContentWrapper>
              <Code css={{ maxWidth: '800px', overflow: 'auto' }}>
                {pollMarkdown}
              </Code>
              <SectionWrapper css={{ marginTop: '20px' }}>
                <Button slim onClick={() => copyToClipboard(pollMarkdown)}>
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
                  value={pollTitle}
                  onChange={e => this.handlePollState(e, 'pollTitle')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Summary:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Give a short description of what this Poll is for"
                  value={pollSummary}
                  onChange={e => this.handlePollState(e, 'pollSummary')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll Start Time:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Date and Time for the Poll to open"
                  value={pollStart}
                  onChange={e => this.handlePollState(e, 'pollStart')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll End Time:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Date and Time for the Poll to close"
                  value={pollEnd}
                  onChange={e => this.handlePollState(e, 'pollEnd')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Discussion Link:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Link to where this Polling proposal will be discussed"
                  value={pollLink}
                  onChange={e => this.handlePollState(e, 'pollLink')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll Rules:</StyledBody>
                <Input
                  width="400px"
                  placeholder=""
                  value={pollRules}
                  onChange={e => this.handlePollState(e, 'pollRules')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Proposal:</StyledBody>
                <TextArea
                  width="600px"
                  height="400px"
                  placeholder="Write (in markdown) the full polling proposal"
                  value={pollContent}
                  onChange={e => this.handlePollState(e, 'pollContent')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Vote Options:</StyledBody>
                <Input
                  width="400px"
                  placeholder="Add possible voting options"
                  value={pollOption}
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
                  {pollOptions.map((opt, idx) => (
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
