import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Grid,
  Text,
  Card,
  Flex,
  Link,
  Table,
  Button,
  Address
} from '@makerdao/ui-components';

import metamaskImg from '../../imgs/metamask.svg';
import trezorImg from '../../imgs/onboarding/trezor-logomark.svg';
import ledgerImg from '../../imgs/onboarding/ledger-logomark.svg';
import newTab from '../../imgs/onboarding/newtab.svg';

const walletTypes = {
  METAMASK: 'metamask',
  LEDGER_LIVE: 'ledger-live',
  LEDGER_LEGACY: 'ledger-legacy',
  TREZOR: 'trezor'
};

const H2 = styled.h2`
  font-weight: 500;
  font-size: 3.2rem;
  letter-spacing: 0.03rem;
`;

const ExternalLink = styled(Link)`
  position: relative;
  &:after {
    margin-left: 0.5rem;
    content: '';
    position: absolute;
    top: calc(50% - 4px);
    bottom: 0;
    mask: url(${newTab}) no-repeat center center;
    height: 8px;
    width: 8px;
    background-color: currentColor;
  }
`;

const Sidebar = ({ show }) => {
  return (
    <Card p="m" gridColumn={['1', '1', '2']} gridRow="span -1">
      <Grid gridRowGap="s">
        <div>
          <Text fontWeight="bold">Ethereum Mainnet</Text>
          <Box fontSize="1.5rem" color="#868997">
            <Table width="100%" variant="cozy">
              <tbody>
                <tr>
                  <td>Contract 1</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td>Contract 2</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td>Contract 3</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>Source code</td>
                  <td
                    style={{
                      maxWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    <ExternalLink
                      style={{ whiteSpace: 'nowrap' }}
                      href="https://github.com/makerdao/governance-dashboard"
                    >
                      https://github.com/makerdao/governance-dashboard
                    </ExternalLink>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Box>
        </div>

        <div>
          <Text fontWeight="bold">What is a hot wallet?</Text>
          <p>
            Your Hot Wallet is connected to the internet. It only holds your MKR
            with the permission to vote within the system, reduce your voting
            power, or increase your voting power.
          </p>
        </div>

        <div>
          <Text fontWeight="bold">Why do I need a voting wallet?</Text>
          <p>
            Your voting wallet enables you to participate in Maker Governance
            without exposing your cold wallet online for every vote.
          </p>
        </div>
      </Grid>
    </Card>
  );
};

const Step = styled.div`
  opacity: 0;
  position: absolute;
  pointer-events: none;

  ${props =>
    props.active &&
    `
    pointer-events: unset;
    position: relative;
    transition: opacity 0.6s;
    opacity: 1;
  `};
`;

const ButtonCard = ({ imgSrc, title, subtitle, onNext }) => {
  return (
    <Card py="s" px="m">
      <Grid
        alignItems="center"
        gridTemplateColumns={['auto 1fr', 'auto 1fr auto']}
        gridRowGap="s"
        gridColumnGap="s"
      >
        <Box pl="s" pr="m">
          <img alt="" src={imgSrc} style={{ maxWidth: '30px' }} />
        </Box>
        <Box flexGrow="1">
          <h3>
            <Text fontSize="1.9rem" letterSpacing="-0.06rem">
              {title}
            </Text>
          </h3>
          <p>{subtitle}</p>
        </Box>
        <Box gridColumn={['1 / 3', '3']}>
          <Button width="100%" onClick={onNext}>
            Connect
          </Button>
        </Box>
      </Grid>
    </Card>
  );
};

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

const LedgerStep = ({ active, onLedgerLive, onLedgerLegacy, onCancel }) => {
  return (
    <Step active={active}>
      <Grid gridRowGap="m">
        <Box textAlign="center" mt={[0, 0, 0, 'l']}>
          <Box mb="s">
            <H2>Ledger live or legacy</H2>
          </Box>
          <Text t="p2">
            <p>
              Due to a firmware update, you will need to choose between Ledger
              Live and Ledger legacy.
            </p>
          </Text>
        </Box>
        <ButtonCard
          imgSrc={ledgerImg}
          onNext={onLedgerLive}
          title="Ledger live"
          subtitle={
            <span>
              Derivation Path:
              <br />
              <Text color="rgba(255, 0, 0, 0.5)">{"44'/60'/0'/${x}"}</Text>
            </span>
          }
        />
        <ButtonCard
          imgSrc={ledgerImg}
          onNext={onLedgerLegacy}
          title="Ledger legacy"
          subtitle={
            <span>
              Derivation Path:
              <br />
              <Text
                color="rgba(255, 0, 0, 0.5)"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {"${purpose}'/${coinType}'/${x}'/0/0"}
              </Text>
            </span>
          }
        />
        <Box justifySelf="start">
          <Button variant="secondary-outline" width="20rem" onClick={onCancel}>
            Back
          </Button>
        </Box>
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
      step: 'select'
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
      step: this.steps.SELECT_WALLET
    });
  }

  selectLedgerWallet() {
    this.setState({
      step: this.steps.SELECT_LEDGER_WALLET
    });
  }

  confirmWallet() {
    this.setState({
      step: this.steps.CONFIRM_WALLET
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
          <Sidebar show={true} />
        </Grid>
      </Box>
    );
  }
}

export default ChooseHotWallet;
