import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import round from 'lodash.round';
import styled from 'styled-components';
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
import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './shared/HotColdTable';
import { Wrapper, Blurb } from './LedgerType';

const TREZOR_PATH = "44'/60'/0'/0/0";

const CircleNumber = styled.div`
  width: 32px;
  min-width: 32px;
  line-height: 28px;
  border-radius: 50%;
  text-align: center;
  font-size: 16px;
  border: 2px solid #30bd9f;
  margin-right: 18px;
  margin-top: 4px;
`;

const ListContainer = styled.div`
  margin-top: 33px;
  margin-left: 32px;
  margin-right: 32px;
`;

const ListItem = styled(Wrapper)`
  margin-bottom: 18px;
`;

const ListText = styled(Blurb)`
  line-height: 25px;
  font-size: 17px;
  color: #868997;
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
                    {cutMiddle(address, 7, 5)}
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

const LedgerLoading = () => (
  <ListContainer>
    <ListItem>
      <CircleNumber>1</CircleNumber>
      <ListText>Connect your Ledger to begin</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>2</CircleNumber>
      <ListText>Open the Ethereum app on the Ledger</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>3</CircleNumber>
      <ListText>
        Ensure the Browser Support and Contract Data is enabled in Settings
      </ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>4</CircleNumber>
      <ListText>
        You may need to update the firmware if Browser Support is not available
      </ListText>
    </ListItem>
  </ListContainer>
);

const TrezorLoading = () => (
  <ListContainer>
    <ListItem>
      <CircleNumber>1</CircleNumber>
      <ListText>Connect your TREZOR Wallet to begin</ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>2</CircleNumber>
      <ListText>
        When the popop asks if you want to export the public key, select export
      </ListText>
    </ListItem>
    <ListItem>
      <CircleNumber>3</CircleNumber>
      <ListText>
        If required, enter your pin or password to unlock the TREZOR
      </ListText>
    </ListItem>
  </ListContainer>
);

const Loading = ({ type }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Connecting to {type} wallet...</StyledTitle>
    </StyledTop>
    {type === 'ledger' ? <LedgerLoading /> : <TrezorLoading />}
  </Fragment>
);
