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

export class AddressSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      selectedIndex: false
    };
  }
  componentDidMount() {
    this.getAddresses("44'/60'/0'/0");
  }

  render() {
    const { getHardwareAccount, modalClose } = this.props;
    const legacyPath = "44'/60'/0'/0/0";
    const ledgerLivePath = "44'/60'/0'/0";
    const accountsOffset = 0;
    if (this.state.addresses.length > 0) {
      return (
        <Fragment>
          <StyledTop>
            <StyledTitle>Select Address on your Ledger</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
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
              disabled={!this.state.selectedIndex}
              onClick={() => {
                getHardwareAccount(LEDGER, {
                  path: ledgerLivePath,
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
            <StyledTitle>Connect to your Ledger Wallet</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
            Couldn't connect
          </StyledBlurb>
          <Button
            slim
            onClick={() => {
              this.getAddresses("44'/60'/0'/0");
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

  async getAddresses(path = '') {
    if (path === '') {
      throw new Error('missing path');
    }
    const askConfirm = false;
    const numAccounts = 5;
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
  { getHardwareAccount, modalClose }
)(AddressSelection);
