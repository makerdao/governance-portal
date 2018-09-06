import React, { Fragment, Component } from 'react';
import { getActiveAccount } from '../../reducers/accounts';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Oblique,
  Bold
} from './shared/styles';
import Button from '../Button';
import { connect } from 'react-redux';
import { breakLink, refreshAccountDataBreak } from '../../reducers/proxy';
import Transaction from './shared/Transaction';
import { modalClose } from '../../reducers/modal';
import Withdraw from './Withdraw';
import { modalOpen } from '../../reducers/modal';
import {
  Table,
  InlineTd,
  AddressContainer,
  CopyBtn,
  CopyBtnIcon
} from './AddressSelection';
import { cutMiddle, copyToClipboard } from '../../utils/misc';
import { getMkrBalance } from '../../chain/read';
import { getBalance } from '../../chain/web3';
import round from 'lodash.round';

export class HotColdTable extends Component {
  async componentDidMount() {
    const { hotAddress, coldAddress } = this.props;
    const [ethHot, ethCold, mkrHot, mkrCold] = await Promise.all([
      getBalance(hotAddress, 3),
      getBalance(coldAddress, 3),
      getMkrBalance(hotAddress, 3),
      getMkrBalance(coldAddress, 3)
    ]);
    this.setState({
      ethHot: round(ethHot, 3),
      ethCold: round(ethCold, 3),
      mkrHot: round(mkrHot, 3),
      mkrCold: round(mkrCold, 3)
    });
  }

  render() {
    const {
      hotAddress,
      coldAddress,
      mkrBalanceCold,
      mkrBalanceHot,
      ethBalanceHot,
      ethBalanceCold
    } = this.props;

    return (
      <AddressContainer style={{ marginTop: '10px' }}>
        <Table>
          <thead>
            <tr>
              <th> Wallet </th>
              <th>Address</th>
              <th>MKR</th>
              <th>ETH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Bold> Cold </Bold>
              </td>
              <InlineTd title={coldAddress}>
                {cutMiddle(coldAddress, 8, 6)}
                <CopyBtn onClick={() => copyToClipboard(coldAddress)}>
                  <CopyBtnIcon />
                </CopyBtn>
              </InlineTd>
              <td>{mkrBalanceCold} MKR</td>
              <td> {ethBalanceCold} ETH </td>
            </tr>
            <tr>
              <td>
                <Bold> Hot </Bold>
              </td>
              <InlineTd title={hotAddress}>
                {cutMiddle(hotAddress, 8, 6)}
                <CopyBtn onClick={() => copyToClipboard(hotAddress)}>
                  <CopyBtnIcon />
                </CopyBtn>
              </InlineTd>
              <td>{mkrBalanceHot} MKR</td>
              <td> {ethBalanceHot} ETH </td>
            </tr>
          </tbody>
        </Table>
      </AddressContainer>
    );
  }
}

const BreakLink = ({
  refreshAccountDataBreak,
  breakLink,
  modalClose,
  modalOpen,
  account,
  txHash,
  confirming,
  network,
  txSent
}) => {
  if (txSent) {
    return (
      <Transaction
        lastCard
        {...{ txHash, confirming, network, account }}
        nextStep={() => {
          modalClose();
          refreshAccountDataBreak();
        }}
      />
    );
  }
  const { linkedAccount } = account.proxy;
  const isColdWallet = account.proxyRole === 'cold';
  const coldAddress = isColdWallet ? account.address : linkedAccount.address;
  const hotAddress = isColdWallet ? linkedAccount.address : account.address;
  const mkrBalanceCold = isColdWallet
    ? account.mkrBalance
    : linkedAccount.mkrBalance;
  const mkrBalanceHot = isColdWallet
    ? linkedAccount.mkrBalance
    : account.mkrBalance;
  if (account.proxy.votingPower > 0) {
    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Break Wallet Link</StyledTitle>
        </StyledTop>
        <StyledBlurb style={{ textAlign: 'center', marginTop: '20px' }}>
          Before you can break your wallet link, you must withdraw all MKR from
          the voting contract
        </StyledBlurb>
        <div
          style={{
            display: 'flex',
            marginTop: '10px',
            justifyContent: 'flex-end'
          }}
        >
          <Button
            slim
            onClick={() => {
              modalOpen(Withdraw);
            }}
          >
            Withdraw MKR
          </Button>
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Break wallet link</StyledTitle>
      </StyledTop>
      <StyledBlurb style={{ textAlign: 'center' }}>
        Both addresses below will be unlinked
      </StyledBlurb>
      <HotColdTable
        hotAddress={hotAddress}
        coldAddress={coldAddress}
        mkrBalanceHot={mkrBalanceHot}
        mkrBalanceCold={mkrBalanceCold}
      />
      <div
        style={{
          display: 'flex',
          marginTop: '20px',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          slim
          onClick={() => {
            breakLink();
          }}
        >
          Break Link
        </Button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  account: getActiveAccount(state),
  txHash: state.proxy.breakLinkTxHash,
  confirming: state.proxy.confirmingBreakLink,
  network: state.metamask.network,
  txSent: !!state.proxy.breakLinkInitiated
});

export default connect(
  mapStateToProps,
  { breakLink, modalClose, refreshAccountDataBreak, modalOpen }
)(BreakLink);
