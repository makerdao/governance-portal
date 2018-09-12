import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';
import { StyledTitle, StyledTop, StyledBlurb } from './shared/styles';
import LedgerType from './LedgerType';

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

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
              ledger: true,
              path: LEDGER_LIVE_PATH
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
              ledger: true,
              path: LEDGER_LEGACY_PATH
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
