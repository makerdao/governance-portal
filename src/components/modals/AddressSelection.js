import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import round from 'lodash.round';
import styled from 'styled-components';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { modalClose } from '../../reducers/modal';
import { addAccount, setActiveAccount } from '../../reducers/accounts';
import { AccountTypes } from '../../utils/constants';
import { cutMiddle, toNum, copyToClipboard } from '../../utils/misc';
import { addToastWithTimeout, ToastTypes } from '../../reducers/toasts';
import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './shared/HotColdTable';
import { Wrapper, Blurb } from './LedgerType';
import Loader from '../Loader';
import { ETH, MKR } from '../../chain/maker';
import theme from '../../theme';

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

const CenteredWrapper = styled(Wrapper)`
  align-self: center;
`;

const ListText = styled(Blurb)`
  line-height: 25px;
  font-size: 17px;
  color: #868997;
`;

const Connecting = styled.div`
  line-height: 24px;
  font-size: 16px;
  color: #231536;
  margin-left: 16px;
  margin-top: 7px;
`;

const PER_PAGE = 5;
class AddressSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pickAccount: () => {},
      accounts: [],
      paginationEnabled: true,
      currentPage: 0,
      selectedIndex: null
    };
  }

  componentDidMount() {
    this.loadAddresses();
  }

  render() {
    const {
      accounts,
      selectedIndex,
      currentPage,
      paginationEnabled
    } = this.state;

    if (accounts.length === 0) {
      return <Loading type={this.props.trezor ? 'trezor' : 'ledger'} />;
    }

    const firstIndex = currentPage * PER_PAGE;
    const lastIndex = currentPage * PER_PAGE + PER_PAGE;
    const slicedAccounts = accounts.slice(firstIndex, lastIndex);

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
                <th className="radio">Select</th>

                <th>#</th>

                <th>Address</th>
                <th>ETH</th>
                <th>MKR</th>
              </tr>
            </thead>
            <tbody>
              {slicedAccounts.map(({ address, eth, mkr, index }) => (
                <tr key={address}>
                  <td className="radio">
                    <input
                      type="radio"
                      name="address"
                      value={index}
                      checked={index === selectedIndex}
                      onChange={() => this.setState({ selectedIndex: index })}
                    />
                  </td>
                  <td>{index + 1}</td>

                  <InlineTd title={address}>
                    {cutMiddle(address, 7, 5)}
                    <CopyBtn onClick={() => copyToClipboard(address)}>
                      <CopyBtnIcon />
                    </CopyBtn>
                  </InlineTd>
                  <td>{eth} ETH</td>
                  <td>{mkr} MKR</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </AddressContainer>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 20
          }}
        >
          <Button
            disabled={currentPage < 1 || !paginationEnabled}
            onClick={this.handleAddressPaginationPrevious}
            color={'grey'}
            hoverColor={'grey'}
            textColor={theme.text.darker_default}
            hoverTextColor={theme.text.darker_default}
            activeColor={'grey'}
            style={{ margin: '0 auto' }}
          >
            Back
          </Button>

          <Button
            disabled={!paginationEnabled}
            color={'grey'}
            hoverColor={'grey'}
            activeColor={'grey'}
            textColor={theme.text.darker_default}
            hoverTextColor={theme.text.darker_default}
            onClick={this.handleAddressPaginationNext}
            style={{ margin: '0 auto' }}
          >
            More
          </Button>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '20px',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            slim
            disabled={selectedIndex === null}
            onClick={this.handleAddressConfirmation}
          >
            Unlock Wallet
          </Button>
        </div>
      </Fragment>
    );
  }

  loadAddresses(page = this.state.currentPage) {
    const { accounts } = this.state;
    const offset = page * PER_PAGE;

    return new Promise(resolve => {
      window.maker
        .addAccount({
          type: this.props.trezor ? 'trezor' : 'ledger',
          path: this.props.path,
          accountsLength: PER_PAGE,
          accountsOffset: offset,
          choose: async (addresses, callback) => {
            const addressesWithInfo = await this.getInfo(addresses, offset);

            this.setState(
              {
                accounts: accounts.concat(addressesWithInfo),
                pickAccount: callback
              },
              resolve
            );
          }
        })
        .then(account => {
          this.handleAddressConfirmationCallback(account);
        })
        .catch(err => {
          this.props.addToastWithTimeout(ToastTypes.ERROR, err.message);
        });
    });
  }

  handleAddressPaginationPrevious = e => {
    this.handleAddressPagination(e, -1);
  };

  handleAddressPaginationNext = e => {
    this.handleAddressPagination(e, 1);
  };

  handleAddressPagination = (e, offset) => {
    const { currentPage } = this.state;
    e.preventDefault();
    const newPage = currentPage + offset;

    Promise.resolve()
      .then(() => {
        this.setState({
          paginationEnabled: false
        });
        return this.loadAddresses(newPage);
      })
      .then(() => {
        this.setState({
          currentPage: newPage,
          paginationEnabled: true
        });
      })
      .catch(() => {
        this.setState({
          paginationEnabled: true
        });
      });
  };

  handleAddressConfirmation = () => {
    const { accounts, selectedIndex, pickAccount } = this.state;
    const address = accounts.find(a => a.index === selectedIndex).address;
    // update maker object
    pickAccount(null, address);
  };

  handleAddressConfirmationCallback({ address }) {
    const { addAccount, setActiveAccount, modalClose, trezor } = this.props;
    // update UI
    addAccount({
      address,
      type: trezor ? AccountTypes.TREZOR : AccountTypes.LEDGER
    }).then(() => setActiveAccount(address));

    modalClose();
  }

  getInfo(addresses, indexOffset) {
    return Promise.all(
      Object.keys(addresses).map(async index => ({
        index: parseInt(indexOffset, 10) + parseInt(index, 10),
        address: addresses[index],
        eth: round(
          await toNum(window.maker.getToken(ETH).balanceOf(addresses[index])),
          3
        ),
        mkr: round(
          await toNum(window.maker.getToken(MKR).balanceOf(addresses[index])),
          3
        )
      }))
    );
  }
}

const mapStateToProps = state => ({
  network: state.metamask.network
});

export default connect(
  mapStateToProps,
  { addAccount, setActiveAccount, addToastWithTimeout, modalClose }
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
      <StyledTitle>Connect your {type} wallet</StyledTitle>
    </StyledTop>
    {type === 'ledger' ? <LedgerLoading /> : <TrezorLoading />}
    <CenteredWrapper>
      <Loader size={40} />
      <Connecting>Connecting...</Connecting>
    </CenteredWrapper>
  </Fragment>
);
