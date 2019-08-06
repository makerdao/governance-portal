import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';
import { Button, Checkbox } from '@makerdao/ui-components';
import { copyToClipboard } from '../../utils/misc';
import { URL_REGEX } from '../../utils/constants';
import CreatePollInput from './CreatePollInput';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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

const Label = styled.label`
  font-size: 0.9em;
  color: #546978;
  margin-left: 10px;
`;

const WarningText = styled.p`
  font-size: 0.9em;
  color: #f35833;
  margin-top: 11px;
`;

class CreatePollOverview extends Component {
  state = {
    confirmCreatePoll: false
  };

  toggleCheckbox = () => {
    this.setState({
      confirmCreatePoll: !this.state.confirmCreatePoll
    });
  };

  render = () => {
    const {
      start,
      end,
      markdown,
      hash,
      url,
      submitAttempted,
      handleParentState,
      execCreatePoll,
      allAccounts
    } = this.props;
    const urlValid = url.match(URL_REGEX);
    const urlError = submitAttempted && !urlValid;

    const execPollValid = allAccounts.length;
    const execPollError = submitAttempted && !execPollValid;

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
          from the {start.toLocaleString('en-GB')} and will close on{' '}
          {end.toLocaleString('en-GB')}.
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

        <div css={{ display: 'flex', alignItems: 'flex-start' }}>
          <Checkbox
            id="createPollCheckbox"
            checked={this.state.confirmCreatePoll}
            onChange={this.toggleCheckbox}
          />
          <Label htmlFor="createPollCheckbox">
            Confirm that you have copied the above content into the cms
          </Label>
        </div>

        <SectionWrapper css={{ marginTop: '20px' }}>
          <Button
            onClick={async () => {
              handleParentState({ submitAttempted: true });
              if (urlValid && execPollValid && this.state.confirmCreatePoll) {
                execCreatePoll();
              }
            }}
            disabled={execPollError && !this.state.confirmCreatePoll}
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

        {execPollError && (
          <SectionWrapper>
            <WarningText>
              User must have an account to create the poll
            </WarningText>
          </SectionWrapper>
        )}
      </Fragment>
    );
  };
}

CreatePollOverview.propTypes = {
  allAccounts: PropTypes.array
};

const mapStateToProps = ({ accounts }, props) => ({
  allAccounts: accounts.allAccounts
});

export default connect(mapStateToProps)(CreatePollOverview);
