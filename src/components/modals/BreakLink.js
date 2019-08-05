import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import mixpanel from 'mixpanel-browser';

import { getActiveAccount } from '../../reducers/accounts';
import { StyledTitle, StyledBlurb, StyledTop } from './shared/styles';
import Button from '../Button';
import { breakLink } from '../../reducers/proxy';
import TransactionModal from './shared/InitiateTransaction';
import { modalClose } from '../../reducers/modal';
import Withdraw from './Withdraw';
import { modalOpen } from '../../reducers/modal';
import HotColdTable from './shared/HotColdTable';
import { formatRound } from '../../utils/misc';
import { ETH } from '../../chain/maker';

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
    const ethToken = window.maker.getToken(ETH);
    const [ethHot, ethCold] = await Promise.all([
      ethToken.balanceOf(hotAddress),
      ethToken.balanceOf(coldAddress)
    ]);
    this.setState({
      ethHot: formatRound(ethHot.toNumber(), 3),
      ethCold: formatRound(ethCold.toNumber(), 3)
    });
  }

  render() {
    const {
      breakLink,
      modalClose,
      modalOpen,
      account,
      txHash,
      txStatus
    } = this.props;
    return (
      <TransactionModal
        txPurpose="This transaction is to break your hot-cold wallet link"
        txHash={txHash}
        txStatus={txStatus}
        account={account}
        onComplete={modalClose}
      >
        {onNext => {
          const { linkedAccount } = account.proxy;
          const isColdWallet = account.proxyRole === 'cold';
          const coldAddress = isColdWallet
            ? account.address
            : linkedAccount.address;
          const hotAddress = isColdWallet
            ? linkedAccount.address
            : account.address;
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
                  Before you can break your wallet link, you must withdraw all
                  MKR from the voting contract
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
                      mixpanel.track('btn-click', {
                        id: 'break-link-withdraw',
                        product: 'governance-dashboard',
                        page: 'BreakLink',
                        section: 'break-link-withdraw-modal'
                      });
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
                    mixpanel.track('btn-click', {
                      id: 'break-link',
                      product: 'governance-dashboard',
                      page: 'BreakLink',
                      section: 'break-link-modal'
                    });
                    breakLink();
                    onNext();
                  }}
                >
                  Break Link
                </Button>
              </div>
            </Fragment>
          );
        }}
      </TransactionModal>
    );
  }
}

const mapStateToProps = state => ({
  account: getActiveAccount(state),
  txHash: state.proxy.breakLinkTxHash,
  txStatus: state.proxy.breakLinkTxStatus
});

export default connect(
  mapStateToProps,
  { breakLink, modalClose, modalOpen }
)(BreakLink);
