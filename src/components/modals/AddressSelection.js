import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { modalClose } from '../../reducers/modal';
import { addAccount } from '../../reducers/accounts';
import { LEDGER, TREZOR } from '../../chain/hw-wallet';
import { createSubProvider } from '../../chain/hw-wallet';
import { getMkrBalance } from '../../chain/read';
import { netNameToId } from '../../utils/ethereum';
import { cutMiddle } from '../../utils/misc';

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
                <th>MKR</th>
                <th className="radio">Select</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(({ address, balance, path }) => (
                <tr key={address}>
                  <td>{cutMiddle(address, 9, 10)}</td>
                  <td>{balance || '…'} MKR</td>
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
    const { addAccount, modalClose, trezor } = this.props;
    const { accounts, selectedPath, subprovider } = this.state;

    addAccount({
      address: accounts.find(a => a.path === selectedPath).address,
      type: trezor ? TREZOR : LEDGER,
      subprovider
    });

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
          balance: await getMkrBalance(accountsObj[path], network)
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
  { addAccount, modalClose }
)(AddressSelection);

const Loading = ({ type }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Connecting to {type} wallet...</StyledTitle>
    </StyledTop>
  </Fragment>
);
