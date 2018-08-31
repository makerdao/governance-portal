import React from 'react';
import { connect } from 'react-redux';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';
import { StyledTitle, StyledTop, StyledBlurb } from './shared/styles';
import LedgerType from './LedgerType';

export const LEDGER_LIVE_PATH = "44'/60'/0'/0/0";
export const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

const CenterBlurb = StyledBlurb.extend`
  text-align: center;
  font-size: 16px;
  line-height: 24px;
  margin-top: 14px;
`;

class PathSelection extends React.Component {
  makeSelection(path, modalOpen) {
    modalOpen(AddressSelection, { ledger: true, path: path });
  }

  render() {
    return (
      <React.Fragment>
        <StyledTop>
          <StyledTitle>Select ledger account type</StyledTitle>
        </StyledTop>
        <CenterBlurb>
          Please select how you created your Ledger wallet
        </CenterBlurb>
        <LedgerType type="live" />
        <hr />
        <LedgerType type="legacy" />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { modalOpen }
)(PathSelection);
