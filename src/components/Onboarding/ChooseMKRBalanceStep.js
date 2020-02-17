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
} from '@makerdao/ui-components-core';

import Loader from '../Loader';
import OnboardingHeader from './shared/OnboardingHeader';
import WithPagination from '../hocs/WithPagination';
import { connectHardwareAccounts } from '../../reducers/accounts';

const ACCOUNTS_PER_PAGE = 5;

class ChooseMKRBalance extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAddress: null
    };
  }

  fetchAccounts = async (page, accountsPerPage) => {
    return await this.props.connectHardwareAccounts(this.props.accountType, {
      live: this.props.isLedgerLive,
      offset: page * accountsPerPage,
      accountsPerPage: accountsPerPage
    });
  };

  selectAddress = address => {
    this.setState({
      selectedAddress: address
    });
  };

  onConfirm = () => {
    this.props.onAccountSelected({
      address: this.state.selectedAddress,
      type: this.props.accountType
    });
  };

  render() {
    return (
      <Grid gridRowGap="m">
        <OnboardingHeader
          mt={[0, 0, 0, 'l']}
          title="Select MKR Balance"
          subtitle="Select the MKR balance that you would like to vote with, and its
        corresponding Ethereum address."
        />
        <WithPagination
          numPerPage={ACCOUNTS_PER_PAGE}
          fetchItems={this.fetchAccounts}
        >
          {({ page, items, error, loading, onNext, onPrev }) => (
            <Card py="m" px="l">
              {error && (
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  opacity="0.6"
                  textAlign="center"
                >
                  <p>
                    There was an error connecting your wallet. Please ensure
                    that your wallet is connected and try again.
                  </p>
                </Flex>
              )}
              {loading && !error && (
                <Flex justifyContent="center" alignItems="center">
                  <Box style={{ opacity: '0.6' }}>
                    <Loader />
                  </Box>
                  <Box ml="s" color="grey">
                    <p>Waiting for approval to access your account</p>
                  </Box>
                </Flex>
              )}
              {!loading && !error && items.length > 0 && (
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
                      {items.map((account, index) => {
                        return (
                          <tr key={account.address}>
                            <td>
                              <Box pr="s" fontSize="1.8rem">
                                <Checkbox
                                  value={account.address}
                                  checked={
                                    this.state.selectedAddress ===
                                    account.address
                                  }
                                  onChange={() =>
                                    this.selectAddress(account.address)
                                  }
                                />
                              </Box>
                            </td>
                            <td>
                              <Box pr="s">
                                {page * ACCOUNTS_PER_PAGE + (index + 1)}
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
                      disabled={page === 0}
                      onClick={onPrev}
                    >
                      Back
                    </Button>
                    <Button variant="secondary-outline" onClick={onNext}>
                      More
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Card>
          )}
        </WithPagination>
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

export default connect(state => ({}), {
  connectHardwareAccounts
})(ChooseMKRBalance);
