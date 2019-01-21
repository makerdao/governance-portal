import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';
import LedgerType from './LedgerType';
import { StyledTitle, StyledTop, StyledBlurb } from './shared/styles';
import { AccountTypes } from '../../utils/constants';

const CenterBlurb = styled(StyledBlurb)`
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  margin-top: 14px;
`;

const Line = styled.hr`
  background-color: #e2e2e2;
  height: 1px;
  margin: 16px 0;
`;

const PathSelection = ({ modalOpen }) => {
  return (
    <React.Fragment>
      <StyledTop>
        <StyledTitle>Select ledger account type</StyledTitle>
      </StyledTop>
      <CenterBlurb>
        Please select how you created your Ledger wallet.{' '}
        {/* TODO: <a>Read more</a> */}
      </CenterBlurb>
      <LedgerType
        type="live"
        connect={() =>
          modalOpen(
            AddressSelection,
            {
              accountType: AccountTypes.LEDGER,
              isLedgerLive: true
            },
            true
          )
        }
      />
      <Line />
      <LedgerType
        type="legacy"
        connect={() =>
          modalOpen(
            AddressSelection,
            {
              accountType: AccountTypes.LEDGER,
              isLedgerLive: false
            },
            true
          )
        }
      />
    </React.Fragment>
  );
};

export default connect(
  null,
  { modalOpen }
)(PathSelection);
