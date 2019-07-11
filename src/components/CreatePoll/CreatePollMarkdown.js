import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button } from '@makerdao/ui-components';
import { Box } from '@makerdao/ui-components-core';
import Card from '../Card';
import closeImg from '../../imgs/close-inline.svg';
import CreatePollInput from './CreatePollInput';
import CreatePollTime from './CreatePollTime';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import 'react-mde/lib/styles/css/react-mde-all.css';

const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const URL_REGEX = new RegExp(expr);
const DEFAULT_START = new Date();

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

const WarningText = styled.p`
  font-size: 0.9em;
  color: #f35833;
  margin-top: 11px;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 40px;
`;

const StyledBody = styled.p`
  width: 150px;
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
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

const VoteOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 20px;
`;

const OptionText = styled.p`
  text-align: left;
  line-height: 30px;
  font-size: 17px;
  color: #fff;
`;

const CloseIcon = styled.p`
  width: 15px;
  height: 15px;
  background-color: red;
  mask: url(${closeImg}) center no-repeat;
  cursor: pointer;
`;

export default function CreatePollMarkdown({
  parentState,
  addPollOption,
  removePollOption,
  handleParentState,
  resetPollState,
  parseMarkdown
}) {
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
  } = parentState;

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

  const handlePollState = (e, key) => {
    e.stopPropagation();
    handleParentState({
      [key]: e.target.value
    });
  };

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
                width: '600px',
                padding: '10px',
                backgroundColor: '#30BD9F'
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
}
