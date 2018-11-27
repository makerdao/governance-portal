import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Loader from './Loader';
import WithTally from './hocs/WithTally';

const NeededToPass = styled.p`
  color: #989fa3;
  display: inline;
  margin-left: 6px;
  &::after {
    content: 'needed to pass';
  }
`;

const Standings = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
  margin-bottom: -12px;
`;

export default connect(({ hat }) => ({
  hat
}))(({ candidate, hat }) => (
  <WithTally candidate={candidate}>
    {({ loadingApprovals, approvals }) => (
      <Standings>
        {' '}
        {loadingApprovals || !hat.approvals ? (
          <Loader size={18} color="light_grey" background="white" />
        ) : (
          hat.approvals - approvals
        )}{' '}
        MKR
        <NeededToPass />
      </Standings>
    )}
  </WithTally>
));
