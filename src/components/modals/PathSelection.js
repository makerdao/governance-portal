import React from 'react';
import { cutMiddle } from '../../utils/misc';
import { getMkrBalance } from '../../chain/read';
import { connect } from 'react-redux';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';
import Withdraw from './Withdraw';
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
  constructor(props) {
    super(props);
  }

  makeSelection(path, modalOpen) {
    modalOpen(AddressSelection, { ledger: true, path: path });
  }

  render() {
    const { modalOpen } = this.props;
    return (
      <React.Fragment>
        <StyledTop>
          <StyledTitle>Select ledger account type</StyledTitle>
        </StyledTop>
        <CenterBlurb>
          Please select how you created your Ledger wallet
        </CenterBlurb>
        <LedgerType type="live" />
        <br />
        <LedgerType type="legacy" />
        <button
          onClick={() => {
            this.makeSelection(LEDGER_LEGACY_PATH, modalOpen);
          }}
        >
          Ledger Legacy
        </button>
        <button
          onClick={() => {
            this.makeSelection(LEDGER_LIVE_PATH, modalOpen);
          }}
        >
          Ledger Live
        </button>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { modalOpen }
)(PathSelection);
