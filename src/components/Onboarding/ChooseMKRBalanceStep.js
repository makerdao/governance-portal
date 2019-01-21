import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Box,
  Card,
  Table,
  Link,
  Button,
  Checkbox,
  Address,
  Flex
} from '@makerdao/ui-components';

import Loader from '../Loader';
import OnboardingHeader from './shared/OnboardingHeader';
import { connectHardwareAccounts } from '../../reducers/accounts';

const ACCOUNTS_PER_PAGE = 5;

class ChooseMKRBalance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accounts: [],
      selectedAddress: null,
      connecting: true,
      error: false,
      page: 0
    };
  }

  selectAddress = address => {
    this.setState({
      selectedAddress: address
    });
  };

  onConfirm = () => {
    const account = this.state.accounts.find(
      account => account.address === this.state.selectedAddress
    );
    this.props.onAccountSelected(account);
  };

  onMoreAccounts = () => {
    const newPage = this.state.page + 1;

    const hasAlreadyBeenFetched =
      newPage * ACCOUNTS_PER_PAGE < this.state.accounts.length;
    this.setState({
      page: newPage
    });

    !hasAlreadyBeenFetched && this.fetchAccounts(newPage);
  };

  onPrevAccounts = () => {
    this.setState({
      page: this.state.page - 1
    });
  };

  fetchAccounts = async page => {
    this.setState({
      connecting: true,
      error: false
    });

    try {
      const accounts = await this.props.connectHardwareAccounts(
        this.props.accountType,
        {
          live: this.props.isLedgerLive,
          offset: page * ACCOUNTS_PER_PAGE,
          accountsPerPage: ACCOUNTS_PER_PAGE
        }
      );

      this.setState({
        connecting: false,
        error: false,
        accounts: this.state.accounts
          .slice(0, page * ACCOUNTS_PER_PAGE)
          .concat(accounts)
          .concat(this.state.accounts.slice((page + 1) * ACCOUNTS_PER_PAGE))
      });
    } catch (err) {
      this.setState({
        connecting: false,
        error: true
      });
    }
  };

  async componentDidMount() {
    this.fetchAccounts(0);
  }

  render() {
    const accountsToShow = this.state.accounts.slice(
      this.state.page * ACCOUNTS_PER_PAGE,
      (this.state.page + 1) * ACCOUNTS_PER_PAGE
    );
    return (
      <Grid gridRowGap="m">
        <OnboardingHeader
          mt={[0, 0, 0, 'l']}
          title="Select MKR Balance"
          subtitle="Select the MKR balance that you would like to vote with, and its
        corresponding Ethereum address."
        />
        <Card py="m" px="l">
          {this.state.error && (
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
          )}
          {this.state.connecting && !this.state.error && (
            <Flex justifyContent="center" alignItems="center">
              <Box style={{ opacity: '0.6' }}>
                <Loader />
              </Box>
              <Box ml="s" color="grey">
                <p>Waiting for approval to access your account</p>
              </Box>
            </Flex>
          )}
          {!this.state.connecting &&
            !this.state.error &&
            accountsToShow.length > 0 && (
              <Grid gridRowGap="s">
                <Table variant="cozy" width="100%">
                  <thead>
                    <tr>
                      <th />
                      <th>#</th>
                      <th>Address</th>
                      <th>MKR</th>
                      <th>ETH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsToShow.map((account, index) => {
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
                            <Box pr="s">
                              {this.state.page * ACCOUNTS_PER_PAGE +
                                (index + 1)}
                            </Box>
                          </td>
                          <td>
                            <Link>
                              <Address full={account.address} shorten />
                            </Link>
                          </td>
                          <td>{account.mkrBalance || '0'} MKR</td>
                          <td>{account.ethBalance || '0'} ETH</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <Grid gridTemplateColumns="auto auto" gridColumnGap="s">
                  <Button
                    variant="secondary-outline"
                    disabled={this.state.page === 0}
                    onClick={this.onPrevAccounts}
                  >
                    Back
                  </Button>
                  <Button
                    variant="secondary-outline"
                    onClick={this.onMoreAccounts}
                  >
                    More
                  </Button>
                </Grid>
              </Grid>
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
    );
  }
}

export default connect(
  state => ({}),
  {
    connectHardwareAccounts
  }
)(ChooseMKRBalance);
