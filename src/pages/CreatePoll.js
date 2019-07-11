import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';
import Card from '../components/Card';
import theme from '../theme';
import { generateIPFSHash } from '../utils/ipfs';
import { Stepper } from '@makerdao/ui-components-core';
import CreatePollOverview from '../components/CreatePoll/CreatePollOverview';
import CreatePollMarkdown from '../components/CreatePoll/CreatePollMarkdown';
import CreatePollResult from '../components/CreatePoll/CreatePollResult';
import {
  POLL_DEFAULT_START,
  POLL_DEFAULT_END,
  PollTxState
} from '../utils/constants';

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

const ABSTAIN = 'Abstain';
const POLL_RULES =
  'The voter may select to vote for one of the poll options or they may elect to abstain from the poll entirely';

const INITIAL_POLL_STATE = {
  title: 'Mock poll',
  summary: 'This is not a real poll',
  start: POLL_DEFAULT_START,
  end: POLL_DEFAULT_END,
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
      pollTxStatus: PollTxState.LOADING
    });
    const { start, end, hash, url } = this.state;
    try {
      const id = await window.maker
        .service('govPolling')
        .createPoll(start.getTime(), end.getTime(), hash, url);
      this.setState({
        id,
        pollTxStatus: PollTxState.SUCCESS
      });
    } catch (e) {
      console.error(e);
      this.setState({ pollTxStatus: PollTxState.ERROR });
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
                    parentState={this.state}
                    addPollOption={this.addPollOption}
                    removePollOption={this.removePollOption}
                    handleParentState={newState => this.setState(newState)}
                    resetPollState={this.resetPollState}
                    parseMarkdown={this.parseMarkdown}
                  />
                );
              case 1:
                return (
                  <CreatePollOverview
                    title={title}
                    start={start}
                    end={end}
                    markdown={markdown}
                    hash={hash}
                    url={url}
                    submitAttempted={submitAttempted}
                    handleParentState={newState => this.setState(newState)}
                    execCreatePoll={this.execCreatePoll}
                  />
                );
              case 2:
                return (
                  <CreatePollResult
                    pollTxStatus={pollTxStatus}
                    id={id}
                    title={title}
                    handleParentState={newState => this.setState(newState)}
                    resetPollState={this.resetPollState}
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
