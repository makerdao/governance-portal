import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import round from 'lodash.round';

import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { modalClose } from '../../reducers/modal';
import { addAccount, setActiveAccount } from '../../reducers/accounts';
import { LEDGER, TREZOR } from '../../chain/hw-wallet';
import { createSubProvider } from '../../chain/hw-wallet';
import { getMkrBalance } from '../../chain/read';
import { getBalance } from '../../chain/web3';
import { netNameToId } from '../../utils/ethereum';
import { cutMiddle, copyToClipboard } from '../../utils/misc';
import copy from '../../imgs/copy.svg';

const TREZOR_PATH = "44'/60'/0'/0/0";

const Table = styled.table`
  width: 100%;
  tr {
    border-bottom: 1px solid #e9e9e9;
  }
  tbody tr:last-child {
    border-bottom: none;
  }
  th,
  td {
    padding: 10px 20px;
  }
  th {
    font-weight: bold;
    opacity: 0.5;
  }
  .radio {
    text-align: center;
  }
`;

const AddressContainer = styled.div`
  border: 1px solid #d7d7d7;
  border-radius: 4px;
  width: 100%;
`;

const InlineTd = styled.td`
  display: inline-flex;
`;

const CopyBtn = styled.div`
  margin-left: 8px;
  margin-right: -8px;
  width: 24px;
  height: 24px;
  display: flex;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const CopyBtnIcon = styled.p`
  height: 14px;
  width: 14px;
  margin: auto;
  background: url(${copy}) no-repeat;
`;

class AddressSelection extends Component {
  constructor(props) {
    super(props);
    this.state = { accounts: [] };
  }

  componentDidMount() {
    if (this.props.trezor) {
      this.getAddresses(TREZOR, TREZOR_PATH);
    } else {
      this.getAddresses(LEDGER, this.props.path);
    }
  }

  render() {
    const { accounts, selectedPath } = this.state;
    if (accounts.length === 0) {
      return <Loading type={this.props.trezor ? 'trezor' : 'ledger'} />;
    }

    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Select address</StyledTitle>
        </StyledTop>
        <StyledBlurb style={{ textAlign: 'center', marginTop: '14px' }}>
          Please select which address you would like to open
        </StyledBlurb>
        <AddressContainer>
          <Table>
            <thead>
              <tr>
                <th>Address</th>
                <th>ETH</th>
                <th>MKR</th>
                <th className="radio">Select</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(({ address, eth, mkr, path }) => (
                <tr key={address}>
                  <InlineTd title={address}>
                    {cutMiddle(address, 8, 6)}
                    <CopyBtn onClick={() => copyToClipboard(address)}>
                      <CopyBtnIcon />
                    </CopyBtn>
                  </InlineTd>
                  <td>{eth} ETH</td>
                  <td>{mkr} MKR</td>
                  <td className="radio">
                    <input
                      type="radio"
                      name="address"
                      value={path}
                      checked={path === selectedPath}
                      onChange={() => this.setState({ selectedPath: path })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
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
            disabled={!selectedPath}
            onClick={this.useSelectedAccount}
          >
            Unlock Wallet
          </Button>
        </div>
      </Fragment>
    );
  }

  useSelectedAccount = () => {
    const { addAccount, setActiveAccount, modalClose, trezor } = this.props;
    const { accounts, selectedPath, subprovider } = this.state;
    const address = accounts.find(a => a.path === selectedPath).address;

    addAccount({
      address,
      type: trezor ? TREZOR : LEDGER,
      subprovider
    }).then(() => setActiveAccount(address));

    modalClose();
  };

  async getAddresses(type, path) {
    const { network } = this.props;
    const combinedOptions = {
      path,
      networkId: netNameToId(network),
      promisify: true,
      accountsLength: 5
    };
    const subprovider = createSubProvider(type, combinedOptions);
    try {
      const accountsObj = await subprovider.getAccounts();
      const accounts = await Promise.all(
        Object.keys(accountsObj).map(async path => ({
          path,
          address: accountsObj[path],
          eth: round(await getBalance(accountsObj[path]), 3),
          mkr: round(await getMkrBalance(accountsObj[path]), 3)
        }))
      );
      console.log(accounts);
      this.setState({ accounts, subprovider });
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
  { addAccount, setActiveAccount, modalClose }
)(AddressSelection);

const Loading = ({ type }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Connecting to {type} wallet...</StyledTitle>
    </StyledTop>
    {/* <StyledBlurb>
      Make sure the latest Ethereum app is installed on your device. If this is
      your first time using this ledger with a dapp, you'll also need to approve
      contract data in the settings.
    </StyledBlurb> */}
    {/* maybe this ^ should fade in after a timeout?
    otherwise it passes by too quick for people who already have their ledger configured
    which makes you feel like you missed something */}
  </Fragment>
);
