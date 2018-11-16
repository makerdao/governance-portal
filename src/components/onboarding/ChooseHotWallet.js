import React from 'react';
import {
  Grid,
  Card,
  Box,
  Text,
  Button,
  Link,
  Address,
  Table,
  Flex,
  Checkbox
} from '@makerdao/ui-components';
import round from 'lodash.round';

import faqs from './faqs';

import LedgerStep from './LedgerStep';
import ChooseMKRBalanceStep from './ChooseMKRBalanceStep';
import Sidebar from './Sidebar';
import H2 from './H2';
import Step from './Step';
import ButtonCard from './ButtonCard';
import WalletIcon from './WalletIcon';

import Loader from '../Loader';

import { toNum } from '../../utils/misc';
import { ETH, MKR } from '../../chain/maker';

import { addAccount } from '../../reducers/accounts';

// the Ledger subprovider interprets these paths to mean that the last digit is
// the one that should be incremented.
// i.e. the second path for Live is "44'/60'/1'/0/0"
// and the second path for Legacy is "44'/60'/0'/0/1"
const LEDGER_LIVE_PATH = "44'/60'/0'";
const LEDGER_LEGACY_PATH = "44'/60'/0'/0";

const SelectAWalletStep = ({
  active,
  onMetamaskSelected,
  onTrezorSelected,
  onLedgerSelected
}) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Box textAlign="center" mt={[0, 0, 0, 'l']}>
          <Box mb="s">
            <H2>Select a voting wallet</H2>
          </Box>
          <Text t="p2">
            <p>
              Select the wallet you would like to use as your voting wallet.
              <br />
              This is a hot wallet and will only be able to vote with your MKR.
            </p>
          </Text>
        </Box>
        <ButtonCard
          icon={<WalletIcon provider="metamask" style={{ maxWidth: '30px' }} />}
          title="MetaMask"
          subtitle="Connect and unlock wallet."
          onNext={onMetamaskSelected}
        />
        <ButtonCard
          icon={<WalletIcon provider="trezor" style={{ maxWidth: '30px' }} />}
          title="Trezor"
          subtitle="Connect via USB and unlock."
          onNext={onTrezorSelected}
        />
        <ButtonCard
          icon={<WalletIcon provider="ledger" style={{ maxWidth: '30px' }} />}
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
  account,
  walletProvider,
  onConfirm,
  onCancel
}) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m" alignContent="start">
        <Text textAlign="center">
          <H2>Confirm voting wallet</H2>
        </Text>
        <Text t="p2" textAlign="center">
          <p>
            By confirming your voting wallet, you will be selecting the hot
            wallet address below. It will only be able to vote with your MKR.
          </p>
        </Text>
        <Card p="m">
          <Grid
            alignItems="center"
            gridTemplateColumns={['auto 1fr auto', 'auto 1fr 1fr auto']}
            gridColumnGap="s"
          >
            <Box>
              <WalletIcon
                provider={walletProvider}
                style={{ maxWidth: '20px' }}
              />
            </Box>
            <Box>
              <Link fontWeight="semibold">
                <Address
                  show={active}
                  full={account && account.address}
                  shorten
                />
              </Link>
            </Box>
            <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
              {account && account.mkrBalance} MKR
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
        <Grid
          gridRowGap="xs"
          gridColumnGap="s"
          gridTemplateColumns={['1fr', 'auto auto']}
          justifySelf={['stretch', 'center']}
        >
          <Button variant="secondary-outline" onClick={onCancel}>
            Change Address
          </Button>
          <Button onClick={onConfirm}>Confirm Voting Wallet</Button>
        </Grid>
      </Grid>
    </Step>
  );
};

class ChooseHotWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 'select',
      faqs: faqs.hotWallet,
      account: undefined,
      walletProvider: undefined,
      onAccountChosen: () => {},
      accountsAvailable: []
    };

    this.steps = {
      SELECT_WALLET: 'select',
      SELECT_LEDGER_WALLET: 'ledger',
      CONFIRM_WALLET: 'confirm'
    };

    this.getInfoFromAddresses = this.getInfoFromAddresses.bind(this);

    this.toSelectAWallet = this.toSelectAWallet.bind(this);
    this.onMetamaskSelected = this.onMetamaskSelected.bind(this);
    this.onTrezorSelected = this.onTrezorSelected.bind(this);
    this.onLedgerSelected = this.onLedgerSelected.bind(this);
    this.onLedgerLiveSelected = this.onLedgerLiveSelected.bind(this);
    this.onLedgerLegacySelected = this.onLedgerLegacySelected.bind(this);
    this.toSelectMKRBalance = this.toSelectMKRBalance.bind(this);
    this.toConfirmWallet = this.toConfirmWallet.bind(this);
    this.onAddressSelected = this.onAddressSelected.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const currentMetamaskAccount = this.props.accounts.find(
      acct => acct.type === 'provider' || acct.type === 'browser'
    );
    if (
      this.state.walletProvider === 'metamask' &&
      !prevState.account &&
      currentMetamaskAccount
    ) {
      this.setState({
        account: currentMetamaskAccount
      });
    }
  }

  toSelectAWallet() {
    this.setState({
      step: this.steps.SELECT_WALLET,
      faqs: faqs.hotWallet,
      account: undefined,
      address: ''
    });
  }

  onMetamaskSelected() {
    const metamaskAccount = this.props.accounts.find(
      acct => acct.type === 'provider' || acct.type === 'browser'
    );
    this.setState({
      walletProvider: 'metamask',
      account: metamaskAccount
    });
    this.toConfirmWallet();
  }

  onTrezorSelected() {
    this.setState({
      walletProvider: 'trezor'
    });

    this.addAccount('trezor');
    this.toSelectMKRBalance();
  }

  onLedgerSelected() {
    this.setState({
      step: this.steps.SELECT_LEDGER_WALLET,
      faqs: faqs.ledger,
      walletProvider: 'ledger'
    });
  }

  onLedgerLiveSelected() {
    this.addAccount('ledger', LEDGER_LIVE_PATH);
    this.toSelectMKRBalance();
  }

  onLedgerLegacySelected() {
    this.addAccount('ledger', LEDGER_LEGACY_PATH);
    this.toSelectMKRBalance();
  }

  toSelectMKRBalance() {
    this.setState({
      step: this.steps.SELECT_MKR_BALANCE,
      faqs: faqs.selectMKRBalance
    });
  }

  toConfirmWallet() {
    this.setState({
      step: this.steps.CONFIRM_WALLET,
      faqs: faqs.hotWallet
    });
  }

  onAddressSelected(address) {
    this.setState({
      account: {
        address
      }
    });
    this.state.onAccountChosen();
  }

  addAccount(accountType, path) {
    window.maker.addAccount({
      type: accountType,
      path: path,
      accountsLength: 5,
      choose: async (addresses, callback) => {
        const accounts = await this.getInfoFromAddresses(addresses || []);
        this.setState({
          accountsAvailable: accounts,
          onAccountChosen: callback
        });
      }
    });
  }

  getInfoFromAddresses(addresses) {
    return Promise.all(
      addresses.map(async (address, index) => ({
        index: index,
        address: address,
        eth: round(
          await toNum(window.maker.getToken(ETH).balanceOf(address)),
          3
        ),
        mkr: round(
          await toNum(window.maker.getToken(MKR).balanceOf(address)),
          3
        )
      }))
    );
  }

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
              onMetamaskSelected={this.onMetamaskSelected}
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
              accounts={this.state.accountsAvailable}
              onAddressSelected={this.onAddressSelected}
              onCancel={this.toSelectAWallet}
            />
            <ConfirmWalletStep
              account={this.state.account}
              walletProvider={this.state.walletProvider}
              active={this.state.step === this.steps.CONFIRM_WALLET}
              onConfirm={() =>
                this.props.onComplete(this.state.account.address)
              }
              onCancel={this.toSelectAWallet}
            />
          </div>
          <Sidebar faqs={this.state.faqs} />
        </Grid>
      </Box>
    );
  }
}

export default ChooseHotWallet;
