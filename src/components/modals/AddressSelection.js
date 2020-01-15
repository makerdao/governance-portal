import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import { Button, Grid } from '@makerdao/ui-components-core';
import styled from 'styled-components';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import { modalClose } from '../../reducers/modal';
import {
  setActiveAccount,
  connectHardwareAccounts,
  addHardwareAccount
} from '../../reducers/accounts';
import { cutMiddle, copyToClipboard } from '../../utils/misc';
import { addToastWithTimeout, ToastTypes } from '../../reducers/toasts';
import {
  AddressContainer,
  Table,
  InlineTd,
  CopyBtn,
  CopyBtnIcon
} from './shared/HotColdTable';
import WithPagination from '../hocs/WithPagination';
import { Wrapper, Blurb } from './LedgerType';
import Loader from '../Loader';

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
      selectedAddress: null
    };
  }

  fetchAccounts = async (page, numPerPage) => {
    try {
      return await this.props.connectHardwareAccounts(this.props.accountType, {
        live: this.props.isLedgerLive,
        offset: page * numPerPage,
        accountsPerPage: numPerPage
      });
    } catch (err) {
      this.props.addToastWithTimeout(ToastTypes.ERROR, err.message);
      throw err;
    }
  };

  handleAddressConfirmation = async () => {
    try {
      await this.props.addHardwareAccount(
        this.state.selectedAddress,
        this.props.accountType
      );
      await this.props.setActiveAccount(this.state.selectedAddress);
      this.props.modalClose();
    } catch (err) {
      this.props.addToastWithTimeout(ToastTypes.ERROR, err.message);
    }
  };

  render() {
    return (
      <WithPagination fetchItems={this.fetchAccounts} numPerPage={PER_PAGE}>
        {({ page, loading, error, items, onNext, onPrev, retry }) => {
          if (loading && items.length <= 0) {
            return <Loading type={this.props.accountType} />;
          } else if (error && items.length <= 0) {
            return <Error type={this.props.accountType} retry={retry} />;
          } else {
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
                      {items.map(
                        ({ address, ethBalance, mkrBalance }, index) => (
                          <tr key={address}>
                            <td className="radio">
                              <input
                                type="radio"
                                name="address"
                                value={index}
                                checked={address === this.state.selectedAddress}
                                onChange={() =>
                                  this.setState({ selectedAddress: address })
                                }
                              />
                            </td>
                            <td>{index + page * PER_PAGE + 1}</td>

                            <InlineTd title={address}>
                              {cutMiddle(address, 7, 5)}
                              <CopyBtn onClick={() => copyToClipboard(address)}>
                                <CopyBtnIcon />
                              </CopyBtn>
                            </InlineTd>
                            <td>{ethBalance} ETH</td>
                            <td>{mkrBalance} MKR</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </AddressContainer>
                <Grid
                  mt="s"
                  mb="s"
                  gridColumnGap="s"
                  gridTemplateColumns="1fr 1fr"
                >
                  <Button
                    variant="secondary-outline"
                    disabled={page < 1 || loading}
                    loading={loading}
                    onClick={onPrev}
                  >
                    Back
                  </Button>
                  <Button
                    variant="secondary-outline"
                    disabled={loading}
                    loading={loading}
                    onClick={onNext}
                  >
                    More
                  </Button>
                </Grid>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '20px',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    disabled={this.state.selectedAddress === null}
                    onClick={this.handleAddressConfirmation}
                  >
                    Unlock Wallet
                  </Button>
                </div>
              </Fragment>
            );
          }
        }}
      </WithPagination>
    );
  }
}

const mapStateToProps = state => ({
  network: state.metamask.network
});

export default connect(mapStateToProps, {
  setActiveAccount,
  addToastWithTimeout,
  modalClose,
  connectHardwareAccounts,
  addHardwareAccount
})(AddressSelection);

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

const Error = ({ type, retry }) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Connect your {type} wallet</StyledTitle>
    </StyledTop>
    <Grid textAlign="center" pt="m" color="makerOrange" gridRowGap="s">
      <p>There was an error connecting your account.</p>
      <div>
        <Button alignSelf="center" onClick={retry}>
          Retry
        </Button>
      </div>
    </Grid>
  </Fragment>
);
