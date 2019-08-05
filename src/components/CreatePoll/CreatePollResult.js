import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Box, Link } from '@makerdao/ui-components-core';
import { Button } from '@makerdao/ui-components';
import Loader from '../Loader';
import { copyToClipboard, cutMiddle } from '../../utils/misc';
import { PollTxState } from '../../utils/constants';
import { netIdToName, ethScanLink } from '../../utils/ethereum';

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

export default function CreatePollResult({
  pollTxStatus,
  id,
  handleParentState,
  resetPollState,
  title,
  txHash
}) {
  const txHashUrl = ethScanLink(
    txHash,
    netIdToName(window.maker.service('web3').networkId())
  );
  console.log(txHashUrl);
  const { LOADING, SUCCESS, ERROR } = PollTxState;
  switch (pollTxStatus) {
    case LOADING:
      return (
        <Fragment>
          <ResultTitle>
            <Link href={txHashUrl} target="_blank">
              Transaction {cutMiddle(txHash, 6)} is in progress...
            </Link>
          </ResultTitle>
          <Box alignSelf="center" mt="40px">
            <Loader size={40} />
          </Box>
        </Fragment>
      );
    case SUCCESS:
      return (
        <Fragment>
          <ResultTitle>
            <Link href={txHashUrl} target="_blank">
              Transaction {cutMiddle(txHash, 6)} completed!
            </Link>
          </ResultTitle>
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
