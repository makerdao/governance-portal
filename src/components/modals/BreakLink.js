import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { breakLink } from '../../reducers/proxy';
import Transaction from './shared/Transaction';
import { modalClose } from '../../reducers/modal';
import Withdraw from './Withdraw';
import { modalOpen } from '../../reducers/modal';
import HotColdTable from './shared/HotColdTable';
import { getBalance } from '../../chain/web3';
import { formatRound } from '../../utils/misc';

class BreakLink extends Component {
  constructor(props) {
    super(props);
    const zero = 0;
    this.state = { ethHot: zero.toFixed(3), ethCold: zero.toFixed(3) };
  }

  async componentDidMount() {
    const { account } = this.props;
    const { linkedAccount } = account.proxy;
    const isColdWallet = account.proxyRole === 'cold';
    const coldAddress = isColdWallet ? account.address : linkedAccount.address;
    const hotAddress = isColdWallet ? linkedAccount.address : account.address;

    const [ethHot, ethCold] = await Promise.all([
      getBalance(hotAddress, 3),
      getBalance(coldAddress, 3)
    ]);
    this.setState({
      ethHot: formatRound(ethHot, 3),
      ethCold: formatRound(ethCold, 3)
    });
  }

  render() {
    const {
      breakLink,
      modalClose,
      modalOpen,
      account,
      txHash,
      confirming,
      network,
      txSent
    } = this.props;
    if (txSent) {
      return (
        <Transaction
          lastCard
          txPurpose="This transaction is to break your hot-cold wallet link"
          {...{ txHash, confirming, network, account }}
          nextStep={() => {
            modalClose();
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
            Before you can break your wallet link, you must withdraw all MKR
            from the voting contract
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
          mkrBalanceHot={formatRound(mkrBalanceHot, 3)}
          mkrBalanceCold={formatRound(mkrBalanceCold, 3)}
          ethBalanceHot={this.state.ethHot}
          ethBalanceCold={this.state.ethCold}
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
  }
}

const mapStateToProps = state => ({
  account: getActiveAccount(state),
  txHash: state.proxy.breakLinkTxHash,
  confirming: state.proxy.confirmingBreakLink,
  network: state.metamask.network,
  txSent: !!state.proxy.breakLinkInitiated
});

export default connect(
  mapStateToProps,
  { breakLink, modalClose, modalOpen }
)(BreakLink);
