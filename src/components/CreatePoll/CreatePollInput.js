import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Input } from '@makerdao/ui-components-core';

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 40px;
`;

const StyledBody = styled.p`
  width: 200px;
  text-align: left;
  line-height: 30px;
  margin-top: 5px;
  font-size: 17px;
  color: #546978;
`;

export default function CreatePollInput({ title, ...inputProps }) {
  return (
    <Fragment>
      <SectionWrapper>
        <StyledBody>{title}:</StyledBody>
        <Input width="600px" {...inputProps} />
      </SectionWrapper>
    </Fragment>
  );
}
