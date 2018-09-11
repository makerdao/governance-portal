import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactGA from 'react-ga';
import Intro from './Intro';
import TOS from './TOS';
import Link from './Link';
import Transaction from '../shared/Transaction';
import Stepper, { progressMap } from './Stepper';
import { getActiveAccount, getAccount } from '../../../reducers/accounts';
import {
  initiateLink,
  approveLink,
  clear as proxyClear,
  goToStep
} from '../../../reducers/proxy';
import { mul } from '../../../utils/misc';
import { modalOpen, modalClose } from '../../../reducers/modal';
import Summary from './Summary';
import MidLink from './MidLink';
import Lock from '../Lock';
import AddressSelection from '../AddressSelection';
import PathSelection from '../PathSelection';

class ProxySetup extends Component {
  componentDidMount() {
    this.props.proxyClear();
    ReactGA.modalview('proxy-setup');
  }

  render() {
    return (
      <Fragment>
        <Stepper progress={progressMap[this.props.setupProgress]} />
        {this.renderContent()}
        {this.props.mockGoToStep && (
          <a
            style={{
              position: 'absolute',
              top: '1px',
              left: '1px',
              fontSize: '8px'
            }}
            onClick={this.props.mockGoToStep}
          >
            Next step
          </a>
        )}
      </Fragment>
    );
  }

  renderContent() {
    const {
      setupProgress,
      goToStep,
      modalOpen,
      modalClose,
      activeAccount,
      accounts,
      network,
      coldAccount,
      hotAccount,
      initiateLink,
      initiateLinkTxHash,
      approveLink,
      approveLinkTxHash,
      sendMkrTxHash,
      sendMkrAmount,
      confirming,
      proxyClear,
      linkCost,
      hotAddress,
      coldAddress
    } = this.props;

    switch (setupProgress) {
      case 'intro':
      default:
        return <Intro linkCost={linkCost} nextStep={() => goToStep('tos')} />;
      case 'tos':
        return (
          <TOS
            modalClose={() => modalClose()}
            nextStep={() => goToStep('link')}
          />
        );
      case 'link':
        return (
          <Link
            initiateLink={initiateLink}
            activeAccount={activeAccount}
            accounts={accounts}
            connectTrezor={() => modalOpen(AddressSelection, { trezor: true })}
            connectLedger={() => modalOpen(PathSelection)}
          />
        );
      case 'initiate':
        return (
          <Transaction
            txPurpose="This transaction is to initiate the link between your wallets. No funds are being moved"
            confirming={confirming}
            network={network}
            txHash={initiateLinkTxHash}
            account={coldAccount}
            nextStep={() => goToStep('midLink')}
          />
        );
      case 'midLink':
        return (
          <MidLink
            hotAddress={hotAddress}
            coldAddress={coldAddress}
            goToStep={goToStep}
            proxyClear={proxyClear}
            nextStep={() => approveLink({ hotAccount })}
          />
        );
      case 'approve':
        return (
          <Transaction
            txPurpose="This transaction is to confirm the link between your wallets. No funds are being moved"
            confirming={confirming}
            network={network}
            txHash={approveLinkTxHash}
            account={hotAccount}
            nextStep={() => goToStep('lockInput')}
          />
        );
      case 'lockInput':
        return <Lock reset={false} />;
      case 'lock':
        return (
          <Transaction
            txPurpose="This transaction is to lock your MKR. Your funds are safe. You can withdrawn them at anytime"
            confirming={confirming}
            network={network}
            txHash={sendMkrTxHash}
            account={coldAccount}
            nextStep={() => goToStep('summary')}
          />
        );
      case 'summary':
        return (
          <Summary
            {...{
              modalClose,
              sendMkrAmount,
              hotAccount
            }}
          />
        );
    }
  }
}

ProxySetup.propTypes = {
  initiateLinkTxHash: PropTypes.string,
  approveLinkTxHash: PropTypes.string,
  sendMkrTxHash: PropTypes.string
};

ProxySetup.defaultProps = {
  initiateLinkTxHash: '',
  approveLinkTxHash: '',
  sendMkrTxHash: ''
};

// flip this if you want to step through the setup steps without actually
// making any changes
let mock = false;

const fakeColdAccount = {
  address: '0xbeefed1bedded2dabbed3defaced4decade5babe',
  type: 'TREZOR',
  proxyRole: 'cold',
  mkrBalance: 456
};

const fakeHotAccount = {
  address: '0xbeefed1bedded2dabbed3defaced4decade5babe',
  type: 'METAMASK',
  proxyRole: 'hot',
  mkrBalance: 123
};

const stateProps = state => {
  const {
    modal,
    metamask,
    accounts,
    eth: { price, gasCost },
    proxy: {
      confirmingBreakLink,
      initiateLinkTxHash,
      approveLinkTxHash,
      sendMkrTxHash,
      sendMkrAmount,
      confirmingInitiate,
      confirmingApprove,
      confirmingSendMkr,
      hotAddress,
      coldAddress,
      setupProgress,
      linkGas
    }
  } = state;

  let props = {
    modal: modal.modal,
    accounts: accounts.allAccounts,
    activeAccount: getActiveAccount({ accounts }),
    network: metamask.network,
    confirmingBreakLink,
    initiateLinkTxHash,
    sendMkrTxHash,
    sendMkrAmount,
    approveLinkTxHash,
    linkCost: mul(mul(linkGas, gasCost), price),
    confirming: confirmingInitiate || confirmingApprove || confirmingSendMkr,
    hotAddress,
    coldAddress,
    hotAccount: getAccount(state, hotAddress),
    coldAccount: getAccount(state, coldAddress),
    setupProgress
  };

  if (mock) {
    props = {
      ...props,
      hotAccount: fakeHotAccount,
      coldAccount: fakeColdAccount,
      sendMkrAmount: 789
    };
  }

  return props;
};

const dispatchProps = {
  modalOpen,
  modalClose,
  initiateLink,
  approveLink,
  proxyClear,
  goToStep
};

if (mock) {
  dispatchProps.mockGoToStep = () => ({ type: 'MOCK_NEXT_STEP' });
}

export default connect(
  stateProps,
  dispatchProps
)(ProxySetup);
