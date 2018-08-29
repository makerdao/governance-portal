import React, { Fragment, Component } from 'react';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { connect } from 'react-redux';
import { modalClose } from '../../reducers/modal';
import { getHardwareAccount } from '../../reducers/accounts';
import { LEDGER } from '../../chain/hw-wallet';
import AppEth from '@ledgerhq/hw-app-eth';
import AddressGenerator from '../../chain/hw-wallet/vendor/address-generator';
import { obtainPathComponentsFromDerivationPath } from '../../chain/hw-wallet/vendor/ledger-subprovider';
import Transport from '@ledgerhq/hw-transport-u2f';
import Address from './shared/Address';
import PathSelection, {
  LEDGER_LIVE_PATH,
  LEDGER_LEGACY_PATH
} from './PathSelection';
import { modalOpen } from '../../reducers/modal';

const TREZOR_PATH = "44'/60'/0'/0";

class AddressSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      selectedIndex: false,
      hwType: ''
    };
  }
  componentDidMount() {
    const { modalProps } = this.props;
    if (modalProps.trezor) {
      this.setState({ hwType: 'Trezor' });
      this.getAddressesTrezor(TREZOR_PATH);
    } else {
      this.setState({ hwType: 'Ledger' });
      this.getAddressesLedger(modalProps.path);
    }
  }

  render() {
    const {
      getHardwareAccount,
      modalClose,
      modalOpen,
      modalProps
    } = this.props;
    if (this.state.addresses.length > 0) {
      return (
        <Fragment>
          <StyledTop>
            <button
              onClick={() => {
                modalOpen(PathSelection);
              }}
            >
              {this.state.hwType === 'Trezor' ? '' : 'Back'}
            </button>
            <StyledTitle>
              Select Address on your {this.state.hwType}
            </StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
            {modalProps.path === LEDGER_LIVE_PATH
              ? 'Ledger Live'
              : this.state.hwType === 'Trezor'
                ? 'Trezor'
                : 'Ledger Legacy'}
            <ul>
              {this.state.addresses.map((address, index) => (
                <li
                  key={address}
                  onClick={() => {
                    this.setState({ selectedIndex: index });
                  }}
                >
                  <Address address={address} />
                </li>
              ))}
            </ul>
          </StyledBlurb>
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}
          >
            <Button
              slim
              disabled={
                !(this.state.selectedIndex || this.state.selectedIndex === 0)
              }
              onClick={() => {
                getHardwareAccount(LEDGER, {
                  path: modalProps.path,
                  accountsOffset: this.state.selectedIndex,
                  accountsLength: 1
                });
                modalClose();
              }}
            >
              Unlock Wallet
            </Button>
          </div>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <StyledTop>
            <button
              onClick={() => {
                modalOpen(PathSelection);
              }}
            >
              Back
            </button>
            <StyledTitle>Connect to your Ledger Wallet</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
            Couldn't connect
          </StyledBlurb>
          <Button
            slim
            onClick={() => {
              this.getAddressesLedger(modalProps.path);
            }}
          >
            Retry
          </Button>
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}
          />
        </Fragment>
      );
    }
  }

  async getAddressesTrezor(path = "44'/60'/0'/0") {}

  async getAddressesLedger(path = '') {
    if (path === '') {
      throw new Error('missing path');
    }
    const askConfirm = false;
    const numAccounts = 1;
    const transport = await Transport.create();
    const eth = new AppEth(transport);
    const addresses = [];
    const pathComponents = obtainPathComponentsFromDerivationPath(path);
    const addr = await eth.getAddress(
      pathComponents.basePath,
      askConfirm,
      true
    );
    const addressGenerator = await new AddressGenerator(addr);
    for (let i = 0; i < numAccounts; i++) {
      const address = addressGenerator.getAddressString(i);
      addresses.push(address);
    }
    this.setState({ addresses: addresses });
  }
}

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  { getHardwareAccount, modalClose, modalOpen }
)(AddressSelection);
