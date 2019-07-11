import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import closeImg from '../imgs/close-inline.svg';
import theme from '../theme';
import { generateIPFSHash } from '../utils/ipfs';
import { calculateTimeSpan } from '../utils/misc';
import { Input, Box, Stepper } from '@makerdao/ui-components-core';
import { Button } from '@makerdao/ui-components';
import { copyToClipboard } from '../utils/misc';
import DateTimePicker from 'react-datetime-picker';
import Loader from '../components/Loader';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

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

const ResultTitle = styled.p`
  text-align: center;
  line-height: 35px;
  margin-top: 20px;
  font-size: 22px;
  color: #546978;
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

const TimeLabel = styled(StyledBody)`
  width: 250px;
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

const WarningText = styled.p`
  font-size: 0.9em;
  color: #f35833;
  margin-top: 11px;
`;

const ABSTAIN = 'Abstain';
const DEFAULT_START = new Date();
const DEFAULT_END = new Date(DEFAULT_START.getTime() + 7 * 24 * 60 * 60 * 1000);
const POLL_RULES =
  'The voter may select to vote for one of the poll options or they may elect to abstain from the poll entirely';
const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const URL_REGEX = new RegExp(expr);
const pollTxState = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const CreatePollInput = ({ title, ...inputProps }) => (
  <Fragment>
    <SectionWrapper>
      <StyledBody>{title}:</StyledBody>
      <Input width="600px" {...inputProps} />
    </SectionWrapper>
  </Fragment>
);

const CreatePollOverview = ({
  start,
  end,
  markdown,
  hash,
  url,
  submitAttempted,
  handleParentState,
  handlePollState,
  execCreatePoll
}) => {
  const urlValid = url.match(URL_REGEX);
  const urlError = submitAttempted && !urlValid;
  return (
    <Fragment>
      <SectionText>
        This is an overview of the new poll. The polling window will be open
        from the {start.toUTCString()} and will close on {end.toUTCString()}.
      </SectionText>
      <SectionText>
        The markdown and hash below should be copied into the cms and a the
        subsequent poll's content url should be retrieved and pasted in the
        input field below.
      </SectionText>
      <SectionWrapper>
        <Box>
          <StyledBody>Markdown:</StyledBody>
          <Button
            css={{ marginTop: '10px' }}
            variant="secondary"
            onClick={() => copyToClipboard(markdown)}
          >
            Copy
          </Button>
        </Box>
        <Code
          css={{
            width: '800px',
            overflow: 'auto',
            cursor: 'pointer'
          }}
          onClick={() => copyToClipboard(markdown)}
        >
          {markdown}
        </Code>
      </SectionWrapper>

      <SectionWrapper>
        <StyledBody>Hash:</StyledBody>
        <SectionText
          css={{
            width: '600px',
            cursor: 'pointer'
          }}
          onClick={() => copyToClipboard(hash)}
        >
          {hash}
        </SectionText>
        <Button
          variant="secondary"
          onClick={() => copyToClipboard(hash)}
          css={{ width: '200px' }}
        >
          Copy
        </Button>
      </SectionWrapper>

      <CreatePollInput
        {...{
          title: 'Poll URL',
          placeholder: 'The URL from which the poll can be found',
          value: url,
          onChange: e => handlePollState(e, 'url'),
          error: urlError,
          failureMessage: urlError && 'The Poll URL must be a valid url',
          width: '800px'
        }}
      />

      <SectionWrapper css={{ marginTop: '20px' }}>
        <Button
          onClick={() => {
            handleParentState({ submitAttempted: true });
            if (urlValid) {
              execCreatePoll();
            }
          }}
        >
          Create Poll
        </Button>
        <Box width="32px" />
        <Button
          variant="secondary"
          onClick={() => handleParentState({ step: 0 })}
        >
          Edit
        </Button>
      </SectionWrapper>
    </Fragment>
  );
};

const CreatePollTime = ({ start, end, timeError, handleParentState }) => (
  <Fragment>
    <SectionWrapper>
      <StyledBody>Poll Start Time:</StyledBody>
      <DateTimePicker
        css={{ width: '600px' }}
        disableClock
        showLeadingZeros
        clearIcon={null}
        onChange={t =>
          handleParentState({
            start: t,
            end: t.getTime() > end.getTime() ? t : end
          })
        }
        value={start}
      />
    </SectionWrapper>
    <SectionWrapper>
      <StyledBody>Poll End Time:</StyledBody>
      <DateTimePicker
        css={{ width: '600px' }}
        disableClock
        showLeadingZeros
        clearIcon={null}
        onChange={t =>
          handleParentState({
            start: t.getTime() < start.getTime() ? t : start,
            end: t
          })
        }
        value={end}
      />
    </SectionWrapper>
    <SectionWrapper>
      <StyledBody>Poll Duration</StyledBody>
      <Box width="600px">
        <TimeLabel>{calculateTimeSpan(start, end)}</TimeLabel>
        {timeError && (
          <WarningText>Start time cannot be a past date</WarningText>
        )}
      </Box>
    </SectionWrapper>
  </Fragment>
);

const CreatePollMarkdown = ({
  state,
  handlePollState,
  addPollOption,
  removePollOption,
  handleParentState,
  resetPollState,
  parseMarkdown
}) => {
  const {
    title,
    summary,
    start,
    end,
    link,
    option,
    choices,
    content,
    submitAttempted,
    selectedTab
  } = state;

  const titleValid = !!title;
  const summaryValid = !!summary;
  const linkValid = link.match(URL_REGEX);
  const choicesValid = choices.length > 1;
  const contentValid = !!content;
  const timeValid = start.getTime() >= DEFAULT_START.getTime();

  const isValidSubmission =
    titleValid &&
    summaryValid &&
    linkValid &&
    choicesValid &&
    contentValid &&
    timeValid;

  const titleError = submitAttempted && !titleValid;
  const summaryError = submitAttempted && !summaryValid;
  const linkError = submitAttempted && !linkValid;
  const choicesError = submitAttempted && !choicesValid;
  const contentError = submitAttempted && !contentValid;
  const timeError = submitAttempted && !timeValid;

  return (
    <Fragment>
      <SectionText>
        This form will generate a formatted markdown file which can be copied
        and included in the cms
      </SectionText>
      {[
        {
          title: 'Title',
          placeholder: 'This will be the poll title',
          value: title,
          onChange: e => handlePollState(e, 'title'),
          error: titleError,
          failureMessage: titleError && 'Title is required'
        },
        {
          title: 'Summary',
          placeholder: 'Give a short description of what this poll is for',
          value: summary,
          onChange: e => handlePollState(e, 'summary'),
          error: summaryError,
          failureMessage: summaryError && 'Summary is required'
        },
        {
          title: 'Discussion Link',
          placeholder: 'Link to where this Polling proposal will be discussed',
          value: link,
          onChange: e => handlePollState(e, 'link'),
          error: linkError,
          failureMessage: linkError && 'Link must be a valid URL'
        },
        {
          title: 'Vote Options',
          placeholder: 'Add possible voting options',
          value: option,
          onChange: e => handlePollState(e, 'option'),
          error: choicesError,
          failureMessage: choicesError && 'Must be at least two voting options',
          after: (
            <Button
              css={{ alignSelf: 'center', marginLeft: '10px' }}
              width="190px"
              onClick={addPollOption}
            >
              Add Option
            </Button>
          )
        }
      ].map((args, i) => (
        <CreatePollInput key={i} {...args} />
      ))}

      <SectionWrapper>
        <StyledBody />
        <VoteOptionsGrid>
          {choices.map((opt, idx) => (
            <Card
              key={idx}
              css={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '300px',
                padding: '10px'
              }}
            >
              <OptionText>
                #{idx} - {opt}
              </OptionText>
              {idx > 0 && <CloseIcon onClick={() => removePollOption(idx)} />}
            </Card>
          ))}
        </VoteOptionsGrid>
      </SectionWrapper>

      <CreatePollTime
        {...{
          start,
          end,
          timeError,
          handleParentState
        }}
      />

      <SectionWrapper>
        <StyledBody>Proposal:</StyledBody>
        <Box width="600px">
          <ReactMde
            value={content}
            onChange={value => handleParentState({ content: value })}
            selectedTab={selectedTab}
            onTabChange={tab => handleParentState({ selectedTab: tab })}
            generateMarkdownPreview={markdown =>
              Promise.resolve(converter.makeHtml(markdown))
            }
          />
          {contentError && <WarningText>Proposal is required</WarningText>}
        </Box>
      </SectionWrapper>

      <SectionWrapper>
        <Button
          onClick={() => {
            handleParentState({
              submitAttempted: true
            });
            if (isValidSubmission) {
              parseMarkdown();
            }
          }}
        >
          Create Markdown
        </Button>
        <Box width="32px" />
        <Button variant="secondary" onClick={resetPollState}>
          Reset Form
        </Button>
      </SectionWrapper>
    </Fragment>
  );
};

const CreatePollResult = ({
  pollTxStatus,
  id,
  handleParentState,
  resetPollState,
  title
}) => {
  const { LOADING, SUCCESS, ERROR } = pollTxState;
  switch (pollTxStatus) {
    case LOADING:
      return (
        <Fragment>
          <ResultTitle>Transaction is in progress...</ResultTitle>
          <Box alignSelf="center" mt="40px">
            <Loader size={40} />
          </Box>
        </Fragment>
      );
    case SUCCESS:
      return (
        <Fragment>
          <ResultTitle>
            Poll #{id} - {title} created!
          </ResultTitle>
          <SectionWrapper>
            <SectionText css={{ textAlign: 'center', marginTop: '30px' }}>
              The Poll ID should now be copied into the cms.
            </SectionText>
          </SectionWrapper>
          <SectionWrapper css={{ marginTop: '20px' }}>
            <Button onClick={() => copyToClipboard(id)} variant="secondary">
              Copy Poll ID
            </Button>
            <Box width="32px" />
            <Button variant="secondary" onClick={resetPollState}>
              Create New Poll
            </Button>
          </SectionWrapper>
        </Fragment>
      );
    case ERROR:
      return (
        <Fragment>
          <ResultTitle>Something is not quite right...</ResultTitle>
          <Button
            css={{ marginTop: '30px' }}
            variant="secondary"
            onClick={() => handleParentState({ step: 1 })}
          >
            Back
          </Button>
        </Fragment>
      );
    default:
      return null;
  }
};

const INITIAL_POLL_STATE = {
  title: 'Mock poll',
  summary: 'This is not a real poll',
  start: DEFAULT_START,
  end: DEFAULT_END,
  link: 'https://mock-polling-url.com/discuss-poll',
  option: '',
  choices: [ABSTAIN, 'Vote1', 'Vote2'],
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
  markdown: '',
  pollTxStatus: null,
  hash: '',
  submitAttempted: false,
  selectedTab: 'write',
  id: null,
  url: '',
  step: 0
};

class CreatePoll extends Component {
  state = INITIAL_POLL_STATE;

  handlePollState = (e, key) => {
    e.stopPropagation();
    this.setState({
      [key]: e.target.value
    });
  };

  addPollOption = () => {
    const { option, choices } = this.state;
    if (option.length) {
      this.setState({
        option: '',
        choices: [...choices, option]
      });
    }
  };

  removePollOption = idx => {
    const { choices } = this.state;
    this.setState({
      choices: choices.filter((_, index) => index !== idx)
    });
  };

  resetPollState = () => {
    this.setState(INITIAL_POLL_STATE);
  };

  parseMarkdown = async () => {
    const { title, summary, link, choices, content } = this.state;
    const choiceString = choices.reduce(
      (acc, opt, idx) => `${acc}   ${idx}: ${opt}\n`,
      ''
    );
    const yml = `---\ntitle: ${title}\nsummary: ${summary}\ndiscussion_link: ${link}\npoll_rules: ${POLL_RULES}\noptions:\n${choiceString}---\n`;
    const md = `# Poll: ${title}\n\n${content}`;
    const ipfsHash = await generateIPFSHash(`${yml}${md}`, {
      encoding: 'ascii'
    });
    this.setState({
      markdown: `${yml}${md}`,
      step: 1,
      submitAttempted: false,
      hash: ipfsHash
    });
  };

  execCreatePoll = async () => {
    this.setState({
      step: 2,
      pollTxStatus: pollTxState.LOADING
    });
    const { start, end, hash, url } = this.state;
    try {
      const id = await window.maker
        .service('govPolling')
        .createPoll(start.getTime(), end.getTime(), hash, url);
      this.setState({
        id,
        pollTxStatus: pollTxState.SUCCESS
      });
    } catch (e) {
      console.error(e);
      this.setState({ pollTxStatus: pollTxState.ERROR });
    }
  };

  render = () => {
    const {
      title,
      start,
      end,
      markdown,
      pollTxStatus,
      hash,
      url,
      submitAttempted,
      id,
      step
    } = this.state;

    const handleParentState = newState => this.setState(newState);

    return (
      <RiseUp>
        <StyledTop>
          <StyledTitle>Create a new Polling proposal</StyledTitle>
        </StyledTop>
        <ContentWrapper>
          <Stepper
            css={{ paddingBottom: '30px' }}
            selected={step}
            steps={[
              'Create Poll Markdown',
              'Deploy Poll Contract',
              'Poll Result'
            ]}
          />
          {(() => {
            switch (step) {
              case 0:
                return (
                  <CreatePollMarkdown
                    {...{
                      state: this.state,
                      handlePollState: this.handlePollState,
                      addPollOption: this.addPollOption,
                      removePollOption: this.removePollOption,
                      handleParentState,
                      resetPollState: this.resetPollState,
                      parseMarkdown: this.parseMarkdown
                    }}
                  />
                );
              case 1:
                return (
                  <CreatePollOverview
                    {...{
                      title,
                      start,
                      end,
                      markdown,
                      hash,
                      url,
                      submitAttempted,
                      handleParentState,
                      handlePollState: this.handlePollState,
                      execCreatePoll: this.execCreatePoll
                    }}
                  />
                );
              case 2:
                return (
                  <CreatePollResult
                    {...{
                      pollTxStatus,
                      id,
                      title,
                      handleParentState,
                      resetPollState: this.resetPollState
                    }}
                  />
                );
              default:
                return null;
            }
          })()}
        </ContentWrapper>
      </RiseUp>
    );
  };
}

export default CreatePoll;
