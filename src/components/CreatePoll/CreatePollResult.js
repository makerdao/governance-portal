import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Box } from '@makerdao/ui-components-core';
import { Button } from '@makerdao/ui-components';
import Loader from '../Loader';
import { copyToClipboard } from '../../utils/misc';

const ResultTitle = styled.p`
  text-align: center;
  line-height: 35px;
  margin-top: 20px;
  font-size: 22px;
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

const pollTxState = {
  LOADING: 'LOADING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS'
};

export default function CreatePollResult({
  pollTxStatus,
  id,
  handleParentState,
  resetPollState,
  title
}) {
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
}
