import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Input, Box } from '@makerdao/ui-components-core';
import { Button } from '@makerdao/ui-components';
import { copyToClipboard } from '../../utils/misc';

const expr = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const URL_REGEX = new RegExp(expr);

const StyledBody = styled.p`
  width: 150px;
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 40px;
`;

const SectionText = styled.p`
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
  margin-bottom: 20px;
`;

const Code = styled.pre`
  font-size: 14px;
  padding: 30px;
  border: 1px solid black;
  white-space: pre-wrap;
`;

const CreatePollInput = ({ title, ...inputProps }) => (
  <Fragment>
    <SectionWrapper>
      <StyledBody>{title}:</StyledBody>
      <Input width="600px" {...inputProps} />
    </SectionWrapper>
  </Fragment>
);

export default function CreatePollOverview({
  start,
  end,
  markdown,
  hash,
  url,
  submitAttempted,
  handleParentState,
  execCreatePoll
}) {
  const urlValid = url.match(URL_REGEX);
  const urlError = submitAttempted && !urlValid;

  const handlePollState = (e, key) => {
    e.stopPropagation();
    handleParentState({
      [key]: e.target.value
    });
  };

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
}
