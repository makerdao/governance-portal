import React from 'react';
import styled from 'styled-components';

import { formatRound } from '../utils/misc';
import Loader from './Loader';
import WithTally from './hocs/WithTally';

const InSupport = styled.p`
  color: #989fa3;
  display: inline;
  margin-left: 6px;
  &::after {
    content: 'in support';
  }
`;

const Standings = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: -12px;
`;

export default ({ candidate }) => (
  <WithTally candidate={candidate}>
    {({ loadingApprovals, approvals }) => (
      <Standings>
        {' '}
        {loadingApprovals ? (
          <Loader size={18} color="light_grey" background="white" />
        ) : (
          formatRound(approvals)
        )}{' '}
        MKR
        <InSupport />
      </Standings>
    )}
  </WithTally>
);
