import React, { Fragment } from 'react';
import { calculateTimeSpan } from '../../utils/misc';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker';
import { Box } from '@makerdao/ui-components-core';

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

const TimeLabel = styled(StyledBody)`
  width: 250px;
`;

const WarningText = styled.p`
  font-size: 0.9em;
  color: #f35833;
  margin-top: 11px;
`;

export default function CreatePollTime({
  start,
  end,
  timeError,
  handleParentState
}) {
  return (
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
}
