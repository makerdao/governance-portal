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

import LedgerStep from './LedgerStep';
import Sidebar from './Sidebar';

import faqs from './faqs';

import H2 from './H2';
import Step from './Step';
import ButtonCard from './ButtonCard';

import metamaskImg from '../../imgs/metamask.svg';
import trezorImg from '../../imgs/onboarding/trezor-logomark.svg';
import ledgerImg from '../../imgs/onboarding/ledger-logomark.svg';

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
          imgSrc={metamaskImg}
          title="MetaMask"
          subtitle="Connect and unlock wallet."
          onNext={onMetamaskSelected}
        />
        <ButtonCard
          imgSrc={trezorImg}
          title="Trezor"
          subtitle="Connect via USB and unlock."
          onNext={onTrezorSelected}
        />
        <ButtonCard
          imgSrc={ledgerImg}
          title="Ledger"
          subtitle="Open and unlock wallet."
          onNext={onLedgerSelected}
        />
      </Grid>
    </Step>
  );
};

const ConfirmWalletStep = ({ active, onConfirm, onCancel }) => {
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
              <img width="20px" alt="" src={metamaskImg} />
            </Box>
            <Box>
              <Link fontWeight="semibold">
                <Address
                  show={active}
                  full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                  shorten
                />
              </Link>
            </Box>
            <Box gridRow={['2', '1']} gridColumn={['1/3', '3']}>
              94.2 ETH, 142.4 MKR
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
      faqs: faqs.hotWallet
    };

    this.steps = {
      SELECT_WALLET: 'select',
      SELECT_LEDGER_WALLET: 'ledger',
      CONFIRM_WALLET: 'confirm'
    };

    this.confirmWallet = this.confirmWallet.bind(this);
    this.selectAWallet = this.selectAWallet.bind(this);
    this.selectLedgerWallet = this.selectLedgerWallet.bind(this);
  }

  selectAWallet() {
    this.setState({
      step: this.steps.SELECT_WALLET,
      faqs: faqs.hotWallet
    });
  }

  selectLedgerWallet() {
    this.setState({
      step: this.steps.SELECT_LEDGER_WALLET,
      faqs: faqs.ledger
    });
  }

  confirmWallet() {
    this.setState({
      step: this.steps.CONFIRM_WALLET,
      faqs: faqs.hotWallet
    });
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
              onMetamaskSelected={this.confirmWallet}
              onTrezorSelected={this.confirmWallet}
              onLedgerSelected={this.selectLedgerWallet}
            />
            <LedgerStep
              active={this.state.step === this.steps.SELECT_LEDGER_WALLET}
              onLedgerLive={this.confirmWallet}
              onLedgerLegacy={this.confirmWallet}
              onCancel={this.selectAWallet}
            />
            <ConfirmWalletStep
              active={this.state.step === this.steps.CONFIRM_WALLET}
              onConfirm={this.props.onComplete}
              onCancel={this.selectAWallet}
            />
          </div>
          <Sidebar faqs={this.state.faqs} />
        </Grid>
      </Box>
    );
  }
}

export default ChooseHotWallet;
