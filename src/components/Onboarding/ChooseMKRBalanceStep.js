import React from 'react';
import {
  Grid,
  Box,
  Text,
  Card,
  Table,
  Link,
  Button,
  Checkbox,
  Address,
  Flex
} from '@makerdao/ui-components';

import H2 from './H2';
import Step from './Step';
import Loader from '../Loader';

class ChooseMKRBalance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAddress: null
    };
  }

  selectAddress = address => {
    this.setState({
      selectedAddress: address
    });
  };

  onConfirm = () => {
    const account = this.props.accounts.find(
      account => account.address === this.state.selectedAddress
    );
    this.props.onAccountSelected(account);
  };

  render() {
    return (
      <Step active={this.props.active}>
        <Grid gridRowGap="m">
          <Box textAlign="center" mt={[0, 0, 0, 'l']}>
            <Box mb="s">
              <H2>Select MKR Balance</H2>
            </Box>
            <Text t="p2">
              <p>
                Select the MKR balance that you would like to vote with, and its
                corresponding Ethereum address.
              </p>
            </Text>
          </Box>
          <Card py="m" px="l">
            {this.props.accounts.length <= 0 &&
              !this.props.connecting && (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  opacity="0.6"
                  textAlign="center"
                >
                  There was an error connecting your wallet. Please ensure that
                  your wallet is connected and try again.
                </Flex>
              )}
            {this.props.accounts.length <= 0 &&
              this.props.connecting && (
                <Flex justifyContent="center" alignItems="center">
                  <Box style={{ opacity: '0.6' }}>
                    <Loader />
                  </Box>
                  <Box ml="s" color="#868997">
                    Waiting for approval to access your account
                  </Box>
                </Flex>
              )}
            {this.props.accounts.length > 0 && (
              <Table variant="cozy" width="100%">
                <thead>
                  <tr>
                    <th />
                    <th>Address</th>
                    <th>MKR</th>
                    <th>ETH</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.accounts.map(account => {
                    return (
                      <tr key={account.address}>
                        <td>
                          <Box pr="s" fontSize="1.8rem">
                            <Checkbox
                              value={account.address}
                              checked={
                                this.state.selectedAddress === account.address
                              }
                              onChange={() =>
                                this.selectAddress(account.address)
                              }
                            />
                          </Box>
                        </td>
                        <td>
                          <Link>
                            <Address full={account.address} shorten />
                          </Link>
                        </td>
                        <td>{account.mkr} MKR</td>
                        <td>{account.eth} ETH</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
          <Grid
            gridRowGap="xs"
            gridColumnGap="s"
            gridTemplateColumns={['1fr', 'auto auto']}
            justifySelf={['stretch', 'center']}
          >
            <Button variant="secondary-outline" onClick={this.props.onCancel}>
              Change wallet
            </Button>
            <Button
              disabled={!this.state.selectedAddress}
              onClick={this.onConfirm}
            >
              Confirm wallet
            </Button>
          </Grid>
        </Grid>
      </Step>
    );
  }
}

export default ChooseMKRBalance;
