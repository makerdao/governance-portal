import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import Button from '../components/Button';
import closeImg from '../imgs/close-inline.svg';
import theme from '../theme';
import { generateIPFSHash } from '../utils/ipfs';
import { TextArea, Input } from '@makerdao/ui-components-core';
import { copyToClipboard } from '../utils/misc';
import DateTimePicker from 'react-datetime-picker';

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
const DEFAULT_START = new Date();
const DEFAULT_END = new Date(DEFAULT_START.getTime() + 7 * 24 * 60 * 60 * 1000);
const MIN_POLL_DURATION = 24 * 60 * 60 * 1000;

const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const URL_REGEX = new RegExp(expr);

function calculateTimeSpan(earlier, later) {
  let timeSpanInSeconds = Math.abs(earlier.getTime() - later.getTime()) / 1000;
  let span = {};
  let timeUnits = {
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  Object.keys(timeUnits).forEach(key => {
    span[key] = Math.floor(timeSpanInSeconds / timeUnits[key]);
    timeSpanInSeconds -= span[key] * timeUnits[key];
  });

  return `${span.week} w : ${span.day} d : ${span.hour} h : ${span.minute} m`;
}

class CreatePoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poll: {
        title: '',
        summary: '',
        start: DEFAULT_START,
        end: DEFAULT_END,
        link: '',
        rules: '',
        option: '',
        choices: [ABSTAIN, NOCHANGE],
        content: ''
      },
      markdown: '',
      canBeDeployed: false,
      hash: ''
    };
  }

  handlePollState = (e, k) => {
    e.stopPropagation();

    this.setState({
      poll: {
        ...this.state.poll,
        [k]: e.target.value
      }
    });
  };

  handlePollStart = t => {
    const { end } = this.state.poll;
    this.setState({
      poll: {
        ...this.state.poll,
        start: t,
        end: t.getTime() > end.getTime() ? t : end
      }
    });
  };

  handlePollEnd = t => {
    const { start } = this.state.poll;
    this.setState({
      poll: {
        ...this.state.poll,
        start: t.getTime() < start.getTime() ? t : start,
        end: t
      }
    });
  };

  addPollVoteOption = () => {
    const { option, choices } = this.state.poll;
    if (option.length) {
      this.setState({
        poll: {
          ...this.state.poll,
          option: '',
          choices: [...choices, option]
        }
      });
    }
  };

  pollTimeWindowIsValid = () => {
    const { start, end } = this.state.poll;
    const pollDuration = end.getTime() - start.getTime();
    if (pollDuration >= MIN_POLL_DURATION) {
      return true;
    } else {
      return false;
    }
  };

  removePollOption = idx => {
    const { choices } = this.state.poll;
    this.setState({
      poll: {
        ...this.state.poll,
        choices: choices.filter((item, index) => index !== idx)
      }
    });
  };

  resetPollState = () => {
    this.setState({
      poll: {
        title: '',
        summary: '',
        start: DEFAULT_START,
        end: DEFAULT_END,
        link: '',
        rules: '',
        option: '',
        choices: [ABSTAIN, NOCHANGE],
        content: ''
      },
      markdown: '',
      canBeDeployed: false
    });
  };

  parseFormToMarkdownString = async () => {
    const { choices, title, summary, link, rules, content } = this.state.poll;
    const choiceString = choices.reduce(
      (acc, opt, idx) => `${acc}   ${idx}: ${opt}\n`,
      ''
    );
    const yml = `---\ntitle: ${title}\nsummary: ${summary}\ndiscussion_link: ${link}\nrules: ${rules}\noptions:\n${choiceString}---\n`;
    const md = `# Poll: ${title}\n\n${content}`;
    const ipfsHash = await generateIPFSHash(`${yml}${md}`, {
      encoding: 'ascii'
    });
    this.setState({
      markdown: `${yml}${md}`,
      canBeDeployed: true,
      hash: ipfsHash
    });
  };

  render = () => {
    const { poll, markdown, canBeDeployed, hash } = this.state;
    const isValidSubmission =
      !!poll.title &&
      !!poll.summary &&
      poll.link.match(URL_REGEX) &&
      poll.choices.length > 2 &&
      !!poll.content &&
      this.pollTimeWindowIsValid();

    return (
      <Fragment>
        {canBeDeployed ? (
          <RiseUp>
            <StyledTop>
              <StyledTitle>Create a new Polling proposal</StyledTitle>
            </StyledTop>
            <ContentWrapper>
              <SectionWrapper>
                <StyledBody>Markdown:</StyledBody>
                <Code css={{ width: '800px', overflow: 'auto' }}>
                  {markdown}
                </Code>
              </SectionWrapper>
              <SectionWrapper>
                <StyledBody>Hash:</StyledBody>
                <SectionText css={{ width: '800px' }}>{hash}</SectionText>
              </SectionWrapper>
              <SectionWrapper css={{ marginTop: '20px' }}>
                <Button slim onClick={() => copyToClipboard(markdown)}>
                  Copy
                </Button>
                <Button
                  slim
                  color="grey"
                  hoverColor="grey"
                  onClick={() => this.setState({ canBeDeployed: false })}
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
                  width="600px"
                  placeholder="This will be the poll title"
                  value={poll.title}
                  onChange={e => this.handlePollState(e, 'title')}
                  success={poll.title.length > 0}
                  error={poll.title.length === 0}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Summary:</StyledBody>
                <Input
                  width="600px"
                  placeholder="Give a short description of what this Poll is for"
                  value={poll.summary}
                  onChange={e => this.handlePollState(e, 'summary')}
                  success={poll.summary.length > 0}
                  error={poll.summary.length === 0}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll Start Time:</StyledBody>
                <DateTimePicker
                  css={{ width: '600px' }}
                  disableClock
                  showLeadingZeros
                  clearIcon
                  onChange={t => this.handlePollStart(t)}
                  value={poll.start}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll End Time:</StyledBody>
                <DateTimePicker
                  css={{ width: '600px' }}
                  disableClock
                  showLeadingZeros
                  clearIcon
                  onChange={t => this.handlePollEnd(t)}
                  value={poll.end}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll Duration</StyledBody>
                <Input
                  width="600px"
                  disabled
                  value={calculateTimeSpan(poll.start, poll.end)}
                  success={this.pollTimeWindowIsValid()}
                  error={!this.pollTimeWindowIsValid()}
                  failureMessage={
                    !this.pollTimeWindowIsValid() &&
                    'Poll must have a duration of at least 1 day'
                  }
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Discussion Link:</StyledBody>
                <Input
                  width="600px"
                  placeholder="Link to where this Polling proposal will be discussed"
                  value={poll.link}
                  onChange={e => this.handlePollState(e, 'link')}
                  success={poll.link.match(URL_REGEX)}
                  error={!poll.link.match(URL_REGEX)}
                  failureMessage={
                    poll.link !== '' &&
                    !poll.link.match(URL_REGEX) &&
                    'This must be a url'
                  }
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Poll Rules:</StyledBody>
                <Input
                  width="600px"
                  placeholder="Indicate how the Poll is to be conducted"
                  value={poll.rules}
                  onChange={e => this.handlePollState(e, 'rules')}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Proposal:</StyledBody>
                <TextArea
                  width="600px"
                  height="400px"
                  placeholder="Write (in markdown) the full polling proposal"
                  value={poll.content}
                  onChange={e => this.handlePollState(e, 'content')}
                  success={poll.content}
                  error={!poll.content}
                />
              </SectionWrapper>

              <SectionWrapper>
                <StyledBody>Vote Options:</StyledBody>
                <Input
                  width="600px"
                  placeholder="Add possible voting options"
                  value={poll.option}
                  onChange={e => this.handlePollState(e, 'option')}
                  maxLength={25}
                  sucess={poll.choices.length > 2}
                  error={poll.choices.length <= 2}
                  failureMessage={
                    poll.choices.length <= 2 &&
                    'Must be at least three voting options'
                  }
                  after={
                    <Button
                      css={{ alignSelf: 'center', marginLeft: '10px' }}
                      width="190px"
                      onClick={this.addPollVoteOption}
                    >
                      Add Option
                    </Button>
                  }
                />
              </SectionWrapper>

              <SectionWrapper>
                <div css={{ width: '215px' }} />
                <VoteOptionsGrid>
                  {poll.choices.map((opt, idx) => (
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

export default CreatePoll;
