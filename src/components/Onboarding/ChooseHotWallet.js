import React from 'react';
import { connect } from 'react-redux';
import { Grid, Card, Box, Button, Flex } from '@makerdao/ui-components';

import faqs from './data/faqs';
import { addMkrAndEthBalance } from './utils';
import { AccountTypes } from '../../utils/constants';

import LedgerStep from './LedgerStep';
import ChooseMKRBalanceStep from './ChooseMKRBalanceStep';
import Sidebar from './shared/Sidebar';
import Stepper from './shared/Stepper';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import ButtonCard from './shared/ButtonCard';
import WalletIcon from './shared/WalletIcon';
import OnboardingHeader from './shared/OnboardingHeader';
import AccountInfo from './shared/AccountInfo';
import { HotWalletTag } from './shared/Tags';

import Loader from '../Loader';

import { resetHotWallet, setHotWallet } from '../../reducers/onboarding';

import {
  connectHardwareAccounts,
  addHardwareAccount
} from '../../reducers/accounts';

const iconWidth = '3rem';

const SelectAWalletStep = ({
  active,
  resetHotWallet,
  onMetamaskSelected,
  onTrezorSelected,
  onLedgerSelected
}) => {
  return (
    <Grid gridRowGap="m" alignContent="start">
      <OnboardingHeader
        mt={[0, 0, 0, 'l']}
        title="Select a voting wallet"
        subtitle={
          <React.Fragment>
            {' '}
            Select the wallet you would like to use as your voting wallet.
            <br />
            This is a hot wallet and will only be able to vote with your MKR.
          </React.Fragment>
        }
      />
      <ButtonCard
        icon={
          <WalletIcon provider="metamask" style={{ maxWidth: iconWidth }} />
        }
        title="MetaMask"
        subtitle="Connect and unlock wallet."
        buttonText="Connect"
        onNext={onMetamaskSelected}
      />
      <ButtonCard
        icon={<WalletIcon provider="trezor" style={{ maxWidth: iconWidth }} />}
        title="Trezor"
        subtitle="Connect via USB and unlock."
        buttonText="Connect"
        onNext={onTrezorSelected}
      />
      <ButtonCard
        icon={<WalletIcon provider="ledger" style={{ maxWidth: iconWidth }} />}
        title="Ledger"
        subtitle="Open and unlock wallet."
        buttonText="Connect"
        onNext={onLedgerSelected}
      />
    </Grid>
  );
};

const ConfirmWalletStep = ({
  active,
  account,
  connecting,
  onConfirm,
  onCancel
}) => {
  return (
    <Grid gridRowGap="l" alignContent="start">
      <OnboardingHeader
        mt={[0, 0, 0, 'l']}
        title="Confirm voting wallet"
        subtitle="By confirming your voting wallet, you will be selecting the hot
    wallet address below. It will only be able to vote with your MKR."
      />
      <div>
        {connecting && (
          <Card p="m" color="grey">
            <Flex justifyContent="center" alignItems="center">
              <Box style={{ opacity: '0.6' }}>
                <Loader />
              </Box>
              <Box ml="s">
                <p>Waiting for approval to access your account</p>
              </Box>
            </Flex>
          </Card>
        )}
        {!account && !connecting && (
          <Card p="m">
            <Flex
              justifyContent="center"
              alignItems="center"
              opacity="0.6"
              textAlign="center"
            >
              <p>
                There was an error connecting your wallet. Please ensure that
                your wallet is connected and try again.
              </p>
            </Flex>
          </Card>
        )}
        {!connecting && account && (
          <AccountInfo account={account} tag={<HotWalletTag />} py="m" />
        )}
      </div>
      <Grid
        gridRowGap="xs"
        gridColumnGap="s"
        gridTemplateColumns={['1fr', 'auto auto']}
        justifySelf={['stretch', 'center']}
      >
        <Button variant="secondary-outline" onClick={onCancel}>
          Change wallet
        </Button>
        <Button disabled={!account || connecting} onClick={onConfirm}>
          Confirm voting wallet
        </Button>
      </Grid>
    </Grid>
  );
};

class ChooseHotWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      faqs: faqs.hotWallet,
      availableAccounts: [],
      connecting: false,
      error: false
    };
  }

  toSelectAWallet = () => {
    this.props.resetHotWallet();
    this.setState({
      step: 0,
      faqs: faqs.hotWallet
    });
  };

  onMetamaskSelected = () => {
    this.setState({
      connecting: true
    });

    const checkMetamaskWallet = async () => {
      const metamaskAccount = this.props.allAccounts.find(
        acct => acct.type === 'provider' || acct.type === 'browser'
      );
      if (!metamaskAccount) {
        setTimeout(checkMetamaskWallet, 500);
      } else {
        this.props.setHotWallet(await addMkrAndEthBalance(metamaskAccount));
        this.setState({
          connecting: false
        });
      }
    };
    setTimeout(checkMetamaskWallet, 0);
    this.toConfirmWallet();
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
      const accountsWithBalances = await Promise.all(
        accounts.map(async account => {
          return await addMkrAndEthBalance(account);
        })
      );

      this.setState({
        availableAccounts: accountsWithBalances,
        connecting: false
      });
    } catch (err) {
      console.error(err);
      this.setState({
        error: true,
        connecting: false
      });
    }
  };

  onTrezorSelected = () => {
    this.connectWallet(AccountTypes.TREZOR);
  };

  onLedgerSelected = () => {
    this.setState({
      step: 1,
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
      step: 2,
      faqs: faqs.selectMKRBalance
    });
  };

  onAccountSelected = account => {
    this.props.addHardwareAccount(account.address, account.type);
    this.props.setHotWallet(account);
    this.toConfirmWallet();
  };

  toConfirmWallet = () => {
    this.setState({
      step: 3,
      faqs: faqs.hotWallet
    });
  };

  render() {
    return (
      <TwoColumnSidebarLayout sidebar={<Sidebar faqs={this.state.faqs} />}>
        <div>
          <Stepper step={this.state.step}>
            <SelectAWalletStep
              onMetamaskSelected={this.onMetamaskSelected}
              onTrezorSelected={this.onTrezorSelected}
              onLedgerSelected={this.onLedgerSelected}
            />
            <LedgerStep
              onLedgerLive={this.onLedgerLiveSelected}
              onLedgerLegacy={this.onLedgerLegacySelected}
              onCancel={this.toSelectAWallet}
            />
            <ChooseMKRBalanceStep
              accounts={this.state.availableAccounts}
              connecting={this.state.connecting}
              error={this.state.error}
              onAccountSelected={this.onAccountSelected}
              onCancel={this.toSelectAWallet}
            />
            <ConfirmWalletStep
              account={this.props.hotWallet}
              connecting={this.state.connecting}
              onConfirm={this.props.onComplete}
              onCancel={this.toSelectAWallet}
            />
          </Stepper>
        </div>
      </TwoColumnSidebarLayout>
    );
  }
}

export default connect(
  state => ({
    allAccounts: state.accounts.allAccounts,
    ...state.onboarding
  }),
  {
    addHardwareAccount,
    connectHardwareAccounts,
    setHotWallet,
    resetHotWallet
  }
)(ChooseHotWallet);
