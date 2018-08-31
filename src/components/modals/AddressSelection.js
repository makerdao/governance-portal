import React, { Fragment, Component } from 'react';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { connect } from 'react-redux';
import { modalClose } from '../../reducers/modal';
import { getHardwareAccount } from '../../reducers/accounts';
import { LEDGER, TREZOR } from '../../chain/hw-wallet';
import Address from './shared/Address';
import { netNameToId } from '../../utils/ethereum';
import { createSubProvider } from '../../chain/hw-wallet';
import styled from 'styled-components';

const TREZOR_PATH = "44'/60'/0'/0";

const AddressContainer = styled.div`
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

class AddressSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addresses: [],
      selectedIndex: false,
      hwType: ''
    };
    this.onSelect = this.onSelect.bind(this);
  }
  componentDidMount() {
    const { network, trezor, path } = this.props;
    if (trezor) {
      this.setState({ hwType: 'trezor' });
      this.getAddresses(network, TREZOR, TREZOR_PATH);
    } else {
      this.setState({ hwType: 'ledger' });
      this.getAddresses(network, LEDGER, path);
    }
  }

  onSelect() {
    this.setState({ selectedIndex: this.state.index });
  }

  render() {
    const { getHardwareAccount, modalClose, path } = this.props;
    if (this.state.addresses.length > 0) {
      return (
        <Fragment>
          <StyledTop>
            <StyledTitle>Select address</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '14px' }}>
            Please select which address you would like to open
          </StyledBlurb>
          <AddressContainer>
            <table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>MKR</th>
                  <th>ETH</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {this.state.addresses.map((address, index) => (
                  <tr key={address}>
                    <Address
                      address={address}
                      index={index}
                      handler={this.onSelect}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </AddressContainer>
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
                  path: path,
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
            <StyledTitle>Connect your {this.state.hwType} wallet</StyledTitle>
          </StyledTop>
          <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
            Couldn't connect
          </StyledBlurb>
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

  async getAddresses(network, type, path = "44'/60'/0'/0", options = {}) {
    this.setState({ addresses: ['0x123'] });
    const combinedOptions = {
      ...options,
      networkId: netNameToId(network),
      promisify: true,
      accountsLength: 5
    };
    const subprovider = createSubProvider(type, combinedOptions);
    try {
      const addresses = await subprovider.getAccounts();
      this.setState({ addresses: Object.values(addresses) });
    } catch (err) {
      console.error(err);
    }
  }
}

const mapStateToProps = state => ({
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { getHardwareAccount, modalClose }
)(AddressSelection);
