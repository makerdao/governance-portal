import React from 'react';
import {
  Grid,
  Card,
  Box,
  Text,
  Button,
  Link,
  Address
} from '@makerdao/ui-components';
import { connect } from 'react-redux';

import faqs from './faqs';
import { AccountTypes } from '../../utils/constants';

import LedgerStep from './LedgerStep';
import Sidebar from './Sidebar';
import WalletIcon from './WalletIcon';
import H2 from './H2';
import Step from './Step';
import ButtonCard from './ButtonCard';
import ChooseMKRBalanceStep from './ChooseMKRBalanceStep';

import linkImg from '../../imgs/onboarding/link.svg';

import { setColdWallet, resetColdWallet } from '../../reducers/onboarding';

import {
  connectHardwareAccounts,
  addHardwareAccount
} from '../../reducers/accounts';

const SelectAWalletStep = ({ active, onTrezorSelected, onLedgerSelected }) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Box textAlign="center" mt={[0, 0, 0, 'l']}>
          <Box mb="s">
            <H2>Select a cold wallet</H2>
          </Box>
          <Text t="p2">
            <p>
              Select the cold wallet that holds your MKR. This selection will
              enable you to vote and will not relinquish the custody that you
              have over your MKR.
            </p>
          </Text>
        </Box>
        <ButtonCard
          icon={<WalletIcon provider="trezor" />}
          title="Trezor"
          subtitle="Connect via USB and unlock."
          onNext={onTrezorSelected}
        />
        <ButtonCard
          icon={<WalletIcon provider="ledger" />}
          title="Ledger"
          subtitle="Open and unlock wallet."
          onNext={onLedgerSelected}
        />
      </Grid>
    </Step>
  );
};

const ConfirmWalletStep = ({
  active,
  hotWallet,
  coldWallet,
  onConfirm,
  onCancel
}) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Text textAlign="center">
          <H2>Link hot and cold wallet</H2>
        </Text>
        <Text t="p2" textAlign="center">
          <p>
            Linking your hot and cold wallet will enable you to vote while your
            MKR is still stored in your cold wallet.
          </p>
        </Text>
        <Grid>
          {coldWallet && (
            <Card p="m" gridColumn="1/3">
              <Grid
                alignItems="center"
                gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr auto']}
                gridColumnGap="s"
              >
                <Box>
                  <WalletIcon
                    provider={coldWallet.type}
                    style={{ maxWidth: '32px', maxHeight: '32px' }}
                  />
                </Box>
                <Box>
                  <Link fontWeight="semibold">
                    <Address show={active} full={coldWallet.address} shorten />
                  </Link>
                </Box>
                <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
                  {coldWallet.eth || '0'} ETH, {coldWallet.mkr || '0'} MKR
                </Box>
                <Box
                  borderRadius="4px"
                  color="#447AFB"
                  bg="#EAF0FF"
                  fontSize="1.2rem"
                  fontWeight="bold"
                  px="xs"
                >
                  COLD WALLET
                </Box>
              </Grid>
            </Card>
          )}
          <Box gridColumn="1" mb="-7px" justifySelf="center">
            <img src={linkImg} alt="" />
          </Box>
          <Box
            gridColumn="2"
            alignSelf="center"
            fontWeight="medium"
            color="#48495F"
          >
            <p>You are linking the above cold wallet to the below hot wallet</p>
          </Box>
          {hotWallet && (
            <Card p="m" gridColumn="1/3">
              <Grid
                alignItems="center"
                gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr auto']}
                gridColumnGap="s"
              >
                <Box>
                  <WalletIcon
                    provider={hotWallet.type}
                    style={{ maxWidth: '27px', maxHeight: '27px' }}
                  />
                </Box>
                <Box>
                  <Link fontWeight="semibold">
                    <Address show={active} full={hotWallet.address} shorten />
                  </Link>
                </Box>
                <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
                  {hotWallet.eth || 0} ETH, {hotWallet.mkr || 0} MKR
                </Box>
                <Box
                  borderRadius="4px"
                  color="#E45432"
                  bg="#FFE2D9"
                  fontSize="1.2rem"
                  fontWeight="bold"
                  px="xs"
                >
                  HOT WALLET
                </Box>
              </Grid>
            </Card>
          )}
        </Grid>
        <Grid
          gridRowGap="xs"
          gridColumnGap="s"
          gridTemplateColumns={['1fr', 'auto auto']}
          justifySelf={['stretch', 'center']}
        >
          <Button variant="secondary-outline" onClick={onCancel}>
            Change wallet
          </Button>
          <Button onClick={onConfirm}>Link wallets</Button>
        </Grid>
      </Grid>
    </Step>
  );
};

class ChooseColdWallet extends React.Component {
  constructor(props) {
    super(props);

    this.steps = {
      SELECT_WALLET: 'SELECT_WALLET',
      SELECT_LEDGER_WALLET: 'SELECT_LEDGER_WALLET',
      SELECT_MKR_BALANCE: 'SELECT_MKR_BALANCE',
      CONFIRM_WALLET: 'CONFIRM_WALLET'
    };

    this.state = {
      step: this.steps.SELECT_WALLET,
      faqs: faqs.coldWallet,
      availableAccounts: [],
      connecting: false,
      error: false
    };
  }

  toSelectAWallet = () => {
    this.props.resetColdWallet();
    this.setState({
      step: this.steps.SELECT_WALLET,
      faqs: faqs.coldWallet
    });
  };

  connectWallet = async (accountType, options = {}) => {
    this.setState({
      connecting: true,
      error: false
    });
    this.toSelectMKRBalance();
    try {
      const accounts = await this.props.connectHardwareAccounts(
        accountType,
        options
      );
      this.setState({
        availableAccounts: accounts,
        connecting: false
      });
    } catch (err) {
      this.setState({
        connecting: false,
        error: true
      });
    }
  };

  onTrezorSelected = async () => {
    this.connectWallet(AccountTypes.TREZOR);
  };

  onLedgerSelected = () => {
    this.setState({
      step: this.steps.SELECT_LEDGER_WALLET,
      faqs: faqs.ledger
    });
  };

  onLedgerLiveSelected = () => {
    this.connectWallet(AccountTypes.LEDGER, { live: true });
  };

  onLedgerLegacySelected = () => {
    this.connectWallet(AccountTypes.LEDGER, { live: false });
  };

  toSelectMKRBalance = () => {
    this.setState({
      step: this.steps.SELECT_MKR_BALANCE,
      faqs: faqs.selectMKRBalance
    });
  };

  onAccountSelected = account => {
    this.props.addHardwareAccount(account.address, account.type);
    this.props.setColdWallet(account);
    this.toConfirmWallet();
  };

  toConfirmWallet = () => {
    this.setState({
      step: this.steps.CONFIRM_WALLET,
      faqs: faqs.selectMKRBalance
    });
  };

  linkWallets = () => {
    this.props.onComplete();
  };

  render() {
    return (
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridRowGap="m"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <div>
            <SelectAWalletStep
              active={this.state.step === this.steps.SELECT_WALLET}
              onTrezorSelected={this.onTrezorSelected}
              onLedgerSelected={this.onLedgerSelected}
            />
            <LedgerStep
              active={this.state.step === this.steps.SELECT_LEDGER_WALLET}
              onLedgerLive={this.onLedgerLiveSelected}
              onLedgerLegacy={this.onLedgerLegacySelected}
              onCancel={this.toSelectAWallet}
            />
            <ChooseMKRBalanceStep
              active={this.state.step === this.steps.SELECT_MKR_BALANCE}
              accounts={this.state.availableAccounts}
              connecting={this.state.connecting}
              error={this.state.error}
              onAccountSelected={this.onAccountSelected}
              onCancel={this.toSelectAWallet}
            />
            <ConfirmWalletStep
              active={this.state.step === this.steps.CONFIRM_WALLET}
              hotWallet={this.props.hotWallet}
              coldWallet={this.props.coldWallet}
              connecting={this.state.connecting}
              onConfirm={this.props.linkWallets}
              onCancel={this.toSelectAWallet}
            />
          </div>
          <Sidebar faqs={this.state.faqs} hotWallet={this.props.hotWallet} />
        </Grid>
      </Box>
    );
  }
}

export default connect(
  state => ({
    ...state.onboarding,
    hardwareAccountsAvailable: state.accounts.hardwareAccountsAvailable
  }),
  {
    connectHardwareAccounts,
    addHardwareAccount,
    setColdWallet,
    resetColdWallet
  }
)(ChooseColdWallet);
