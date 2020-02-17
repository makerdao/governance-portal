import React from 'react';
import { Grid, Box, Button, Flex } from '@makerdao/ui-components-core';
import { connect } from 'react-redux';

import { AccountTypes } from '../../utils/constants';
import { addMkrAndEthBalance } from '../../utils/misc';

import LedgerStep from './LedgerStep';
import Sidebar from './shared/Sidebar';
import OnboardingHeader from './shared/OnboardingHeader';
import Stepper from './shared/Stepper';
import ButtonCard from './shared/ButtonCard';
import WalletIcon from './shared/WalletIcon';
import AccountInfo from './shared/AccountInfo';
import TwoColumnSidebarLayout from './shared/TwoColumnSidebarLayout';
import faqs from './data/faqs';
import { HotWalletTag, ColdWalletTag } from './shared/Tags';

import ChooseMKRBalanceStep from './ChooseMKRBalanceStep';

import linkImg from '../../imgs/onboarding/link.svg';

import { setColdWallet, resetColdWallet } from '../../reducers/onboarding';
import { setActiveAccount } from '../../reducers/accounts';

import { addHardwareAccount } from '../../reducers/accounts';

const imageWidth = '5rem';

const SelectAWalletStep = ({
  active,
  onTrezorSelected,
  onLedgerSelected,
  onCancel
}) => {
  return (
    <Grid gridRowGap="m" alignContent="start">
      <OnboardingHeader
        mt={[0, 0, 0, 'l']}
        title="Select a cold wallet"
        subtitle="Select the cold wallet that holds your MKR. This selection will
      enable you to vote and will not relinquish the custody that you
      have over your MKR."
      />
      <ButtonCard
        icon={<WalletIcon provider="trezor" />}
        title="Trezor"
        subtitle="Connect via USB and unlock."
        buttonText="Connect"
        onNext={onTrezorSelected}
      />
      <ButtonCard
        icon={<WalletIcon provider="ledger" />}
        title="Ledger"
        subtitle="Open and unlock wallet."
        buttonText="Connect"
        onNext={onLedgerSelected}
      />
      <Flex justifyContent="right">
        <Button variant="secondary-outline" onClick={onCancel}>
          Change hot wallet
        </Button>
      </Flex>
    </Grid>
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
    <Grid gridRowGap="l" alignContent="start">
      <OnboardingHeader
        mt={[0, 0, 0, 'l']}
        title="Link hot and cold wallet"
        subtitle="Linking your hot and cold wallet will enable you to vote while your MKR is still stored in your cold wallet."
      />
      <div>
        <AccountInfo account={coldWallet} tag={<ColdWalletTag />} />
        <Grid gridTemplateColumns={`${imageWidth} 1fr`} justifyItems="center">
          <img src={linkImg} alt="" />
          <Box alignSelf="center" fontWeight="medium" color="greys.dark">
            <p>You are linking the above cold wallet to the below hot wallet</p>
          </Box>
        </Grid>

        <AccountInfo account={hotWallet} tag={<HotWalletTag />} />
      </div>
      <Grid
        gridRowGap="xs"
        gridColumnGap="s"
        gridTemplateColumns={['1fr', 'auto auto']}
        justifySelf={['stretch', 'end']}
      >
        <Button variant="secondary-outline" onClick={onCancel}>
          Change wallet
        </Button>
        <Button onClick={onConfirm}>Link wallets</Button>
      </Grid>
    </Grid>
  );
};

class ChooseColdWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      faqs: faqs.coldWallet,
      accountType: null,
      isLedgerLive: false,
      connecting: false,
      error: false
    };
  }

  toSelectAWallet = () => {
    this.props.resetColdWallet();
    this.setState({
      step: 0,
      faqs: faqs.coldWallet
    });
  };

  onTrezorSelected = async () => {
    this.setState({
      accountType: AccountTypes.TREZOR,
      isLedgerLive: false
    });
    this.toSelectMKRBalance();
  };

  onLedgerSelected = () => {
    this.setState({
      step: 1,
      faqs: faqs.ledger
    });
  };

  onLedgerLiveSelected = () => {
    this.setState({
      accountType: AccountTypes.LEDGER,
      isLedgerLive: true
    });
    this.toSelectMKRBalance();
  };

  onLedgerLegacySelected = () => {
    this.setState({
      accountType: AccountTypes.LEDGER,
      isLedgerLive: false
    });
    this.toSelectMKRBalance();
  };

  toSelectMKRBalance = () => {
    this.setState({
      step: 2,
      faqs: faqs.selectMKRBalance
    });
  };

  onAccountSelected = async account => {
    await this.props.addHardwareAccount(account.address, account.type);
    this.props.setColdWallet(await addMkrAndEthBalance(account));
    this.props.setActiveAccount(this.props.coldWallet.address);
    this.toConfirmWallet();
  };

  toConfirmWallet = () => {
    this.setState({
      step: 3,
      faqs: faqs.selectMKRBalance
    });
  };

  render() {
    return (
      <TwoColumnSidebarLayout
        sidebar={
          <Sidebar faqs={this.state.faqs} hotWallet={this.props.hotWallet} />
        }
      >
        <Stepper step={this.state.step}>
          <SelectAWalletStep
            onTrezorSelected={this.onTrezorSelected}
            onLedgerSelected={this.onLedgerSelected}
            onCancel={this.props.onCancel}
          />
          <LedgerStep
            onLedgerLive={this.onLedgerLiveSelected}
            onLedgerLegacy={this.onLedgerLegacySelected}
            onCancel={this.toSelectAWallet}
          />
          <ChooseMKRBalanceStep
            accountType={this.state.accountType}
            isLedgerLive={this.state.isLedgerLive}
            onAccountSelected={this.onAccountSelected}
            onCancel={this.toSelectAWallet}
          />
          <ConfirmWalletStep
            hotWallet={this.props.hotWallet}
            coldWallet={this.props.coldWallet}
            connecting={this.state.connecting}
            onConfirm={this.props.onComplete}
            onCancel={this.toSelectAWallet}
          />
        </Stepper>
      </TwoColumnSidebarLayout>
    );
  }
}

export default connect(
  state => ({
    ...state.onboarding
  }),
  {
    addHardwareAccount,
    setColdWallet,
    resetColdWallet,
    setActiveAccount
  }
)(ChooseColdWallet);
