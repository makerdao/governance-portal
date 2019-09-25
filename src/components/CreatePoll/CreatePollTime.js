import React, { Fragment } from 'react';
import { calculateTimeSpan } from '../../utils/misc';
import styled from 'styled-components';
import DateTimePicker from 'react-datetime-picker';
import { Box } from '@makerdao/ui-components-core';

const StyledBody = styled.p`
  width: 200px;
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
  width: 400px;
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
  const startUTC = new Date(start).toUTCString();
  const endUTC = new Date(end).toUTCString();

  return (
    <Fragment>
      <SectionWrapper>
        <StyledBody>Poll Start Time (Local):</StyledBody>
        <DateTimePicker
          css={{ width: '600px' }}
          disableClock
          showLeadingZeros
          clearIcon={null}
          onChange={t =>
            handleParentState({
              start: t.getTime(),
              end: t.getTime() > end ? t.getTime() : end
            })
          }
          value={new Date(start)}
        />
      </SectionWrapper>
      <SectionWrapper>
        <StyledBody>Poll Start Time (UTC):</StyledBody>
        <Box width="600px">
          <TimeLabel>{startUTC.substring(0, startUTC.length - 4)}</TimeLabel>
        </Box>
      </SectionWrapper>
      <SectionWrapper>
        <StyledBody>Poll End Time (Local):</StyledBody>
        <DateTimePicker
          css={{ width: '600px' }}
          disableClock
          showLeadingZeros
          clearIcon={null}
          onChange={t =>
            handleParentState({
              start: t.getTime() < start ? t.getTime() : start,
              end: t.getTime()
            })
          }
          value={new Date(end)}
        />
      </SectionWrapper>
      <SectionWrapper>
        <StyledBody>Poll Start Time (UTC):</StyledBody>
        <Box width="600px">
          <TimeLabel>{endUTC.substring(0, endUTC.length - 4)}</TimeLabel>
        </Box>
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
