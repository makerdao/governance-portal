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
import trezorImg from '../../imgs/trezor.png';
import ledgerImg from '../../imgs/ledger.svg';

const Sidebar = ({ show }) => {
  return (
    <Card p="m" gridColumn={['1', '1', '2']} gridRow="span -1">
      <Grid gridRowGap="s">
        <div>
          <Text fontWeight="bold">Ethereum Mainnet</Text>
          <Table width="100%" variant="cozy">
            <tbody>
              <tr>
                <td>Contract 1</td>
                <td>
                  <Link>
                    <Address
                      full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                      show={show}
                      shorten
                    />
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Contract 2</td>
                <td>
                  <Link>
                    <Address
                      full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                      show={show}
                      shorten
                    />
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Contract 3</td>
                <td>
                  <Link>
                    <Address
                      full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                      show={show}
                      shorten
                    />
                  </Link>
                </td>
              </tr>
              <tr>
                <td style={{ whiteSpace: 'nowrap' }}>Source code</td>
                <td style={{ maxWidth: 0, overflow: 'hidden' }}>
                  <Link
                    style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    https://github.com/makerdao/governance-dashboard
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
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

const SelectAWalletStep = props => {
  return (
    <Step active={props.active}>
      <Grid gridRowGap="m" alignContent="start">
        <Text textAlign="center">
          <h2>Select a hot wallet</h2>
        </Text>
        <Text t="p2" textAlign="center">
          <p>
            Select the wallet you would like to use as your voting wallet.
            <br />
            This is a hot wallet and will only be able to vote with your MKR.
          </p>
        </Text>
        <Card p="s">
          <Flex alignItems="center">
            <Box pl="s" pr="m">
              <img width="20px" alt="" src={metamaskImg} />
            </Box>
            <Box flexGrow="1" pr="s">
              <h3>Metamask</h3>
              <p>Open and unlock wallet</p>
            </Box>
            <Button onClick={props.onNextStep}>Connect</Button>
          </Flex>
        </Card>
        <Card p="s">
          <Flex alignItems="center">
            <Box pl="s" pr="m">
              <img width="20px" alt="" src={trezorImg} />
            </Box>
            <Box flexGrow="1" pr="s">
              <h3>Trezor</h3>
              <p>Connect via USB and unlock</p>
            </Box>
            <Button onClick={props.onNextStep}>Connect</Button>
          </Flex>
        </Card>
        <Card p="s">
          <Flex alignItems="center">
            <Box pl="s" pr="m">
              <img width="20px" alt="" src={ledgerImg} />
            </Box>
            <Box flexGrow="1" pr="s">
              <h3>Ledger</h3>
              <p>Open and unlock wallet</p>
            </Box>
            <Button onClick={props.onNextStep}>Connect</Button>
          </Flex>
        </Card>
      </Grid>
    </Step>
  );
};

const ConfirmWalletStep = props => {
  return (
    <Step active={props.active}>
      <Grid gridRowGap="m" alignContent="start">
        <Text textAlign="center">
          <h2>Confirm Voting Wallet</h2>
        </Text>
        <Text t="p2" textAlign="center">
          <p>
            By confirming your Voting Wallet, you will be selecting the hot
            wallet address below. It will only be able to vote with your MKR.
          </p>
        </Text>
        <Card p="s">
          <Flex alignItems="center">
            <Box pl="s" pr="m">
              <img width="20px" alt="" src={metamaskImg} />
            </Box>
            <Box flexGrow="1" pr="s">
              <Address
                show={props.active}
                full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                shorten
              />
            </Box>
          </Flex>
        </Card>
        <div>
          <Button variant="secondary-outline" mr="s" onClick={props.onCancel}>
            Change Address
          </Button>
          <Button onClick={props.onNextStep}>Confirm Voting Wallet</Button>
        </div>
      </Grid>
    </Step>
  );
};

class ChooseHotWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0
    };

    this.confirmWallet = this.confirmWallet.bind(this);
    this.selectAWallet = this.selectAWallet.bind(this);
  }

  selectAWallet() {
    this.setState({
      step: 0
    });
  }

  confirmWallet() {
    this.setState({
      step: 1
    });
  }

  render() {
    return (
      <Box maxWidth="930px" m="0 auto">
        <Grid
          gridColumnGap="xl"
          gridTemplateColumns={['1fr', '1fr', 'auto 340px']}
        >
          <div>
            <SelectAWalletStep
              onNextStep={this.confirmWallet}
              active={this.state.step === 0}
            />
            <ConfirmWalletStep
              onNextStep={this.props.onComplete}
              onCancel={this.selectAWallet}
              active={this.state.step === 1}
            />
          </div>
          <Sidebar show={true} />
        </Grid>
      </Box>
    );
  }
}

export default ChooseHotWallet;
