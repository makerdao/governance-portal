import React from 'react';
import { cutMiddle } from '../../utils/misc';
import { getMkrBalance } from '../../chain/read';
import { connect } from 'react-redux';
import { setPath } from '../../reducers/accounts';
import { modalOpen } from '../../reducers/modal';
import AddressSelection from './AddressSelection';
import { StyledTitle, StyledTop } from './shared/styles';

export const LEDGER_LIVE_PATH = "44'/60'/0'/0";
export const LEDGER_LEGACY_PATH = "44'/60'/0'/0/0";

class PathSelection extends React.Component {
  constructor(props) {
    super(props);
  }

  makeSelection(path, setPath) {
    setPath(path);
    modalOpen(AddressSelection);
  }

  render() {
    const { setPath } = this.props;
    return (
      <React.Fragment>
        <StyledTop>
          <StyledTitle>Select Ledger Account Type</StyledTitle>
        </StyledTop>
        <button
          onClick={() => {
            this.makeSelection(LEDGER_LEGACY_PATH, setPath);
          }}
        >
          Ledger Legacy
        </button>
        <button
          onClick={() => {
            this.makeSelection(LEDGER_LIVE_PATH, setPath);
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
  { setPath, modalOpen }
)(PathSelection);
