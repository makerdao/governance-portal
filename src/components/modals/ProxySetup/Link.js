import React, { Fragment, Component } from 'react';
import differenceWith from 'ramda/src/differenceWith';
import styled from 'styled-components';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  TooltipCard,
  InputLabels,
  StyledAnchor,
  EndButton,
  Dim,
  Note
} from '../shared/styles';
import Dropdown from '../../Dropdown';
import { AccountBlurb } from '../../AccountBox';
import { AccountTypes } from '../../../utils/constants';
import { eq } from '../../../utils/misc';

const Swap = styled.button`
  cursor: pointer;
  pointer-events: ${({ dim }) => (dim ? 'none' : 'auto')};
  opacity: ${({ dim }) => (dim ? '0.5' : '1')};
  font-size: 16px;
  margin-top: 8px;
`;

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hot: props.activeAccount,
      cold: null
    };
  }

  componentDidUpdate(prevProps) {
    if (!this.state.cold) {
      const newAccounts = differenceWith(
        (a, b) => eq(a.address, b.address),
        this.props.accounts,
        prevProps.accounts
      );

      const hardwareAccount = newAccounts.find(
        a => a.type === AccountTypes.LEDGER || a.type === AccountTypes.TREZOR
      );

      if (hardwareAccount) this.setState({ cold: hardwareAccount });
    }
  }

  swapAccountTypes = () =>
    this.setState(({ hot, cold }) => ({ hot: cold, cold: hot }));

  render() {
    const hotExists = this.state.hot && this.state.hot.address.length > 0;
    const coldExists = this.state.cold && this.state.cold.address.length > 0;
    const swappable = !!coldExists && !!hotExists;
    const validAccounts = this.props.accounts.filter(account => {
      return !account.hasProxy;
    });
    const someAccountAlreadyLinked =
      validAccounts.length < this.props.accounts.length;
    const accountsMinusHot = this.state.hot
      ? differenceWith((a, b) => eq(a.address, b.address), validAccounts, [
          this.state.hot
        ])
      : validAccounts;

    const accountsMinusCold = this.state.cold
      ? differenceWith((a, b) => eq(a.address, b.address), validAccounts, [
          this.state.cold
        ])
      : validAccounts;

    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>Link cold and hot wallets</StyledTitle>
        </StyledTop>
        <StyledBlurb>
          Please connect your{' '}
          <TooltipCard
            link="https://google.com"
            body="This is where you store your MKR. You will be able to send your tokens back to this account at any time."
            title="Cold Wallet"
          >
            cold wallet
          </TooltipCard>
          , we support MetaMask, Ledger and Trezor. Then select the{' '}
          <TooltipCard
            link="https://google.com"
            body="This the wallet you vote with. This account will never be able to withdraw your tokens to itself."
            title="Hot Wallet"
          >
            hot wallet
          </TooltipCard>{' '}
          you would like to link it to.
        </StyledBlurb>
        <InputLabels>Select cold wallet</InputLabels>
        <Dropdown
          value={this.state.cold}
          onSelect={account => this.setState({ cold: account })}
          items={accountsMinusHot}
          itemKey="address"
          emptyMsg={
            someAccountAlreadyLinked
              ? 'no other not already linked accounts detected'
              : ''
          }
          renderItem={account => (
            <AccountBlurb
              noAddressCut
              type={account.type}
              address={account.address}
            />
          )}
        />
        <Note style={{ opacity: '1' }}>
          <Dim>This wallet must be connected. How to connect</Dim>{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://google.com"
          >
            MetaMask,
          </a>{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://google.com"
          >
            Ledger
          </a>{' '}
          <Dim>and</Dim>{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://google.com"
          >
            Trezor
          </a>
        </Note>
        <Swap dim={!swappable} onClick={this.swapAccountTypes}>
          ▲ swap ▼
        </Swap>
        <InputLabels>Select hot wallet</InputLabels>
        <Dropdown
          value={this.state.hot}
          onSelect={account => this.setState({ hot: account })}
          items={accountsMinusCold}
          itemKey="address"
          emptyMsg={
            someAccountAlreadyLinked
              ? 'no other not already linked accounts detected'
              : ''
          }
          renderItem={account => (
            <AccountBlurb
              noAddressCut
              type={account.type}
              address={account.address}
            />
          )}
        />
        <Note>
          Reminder: this is the address that will be able to vote with your MKR.
        </Note>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '20px'
          }}
        >
          <StyledAnchor blue>Read more about linking</StyledAnchor>
          <EndButton
            style={{ marginTop: '0' }}
            slim
            onClick={() =>
              this.props.initiateLink({
                cold: this.state.cold,
                hot: this.state.hot
              })
            }
          >
            Link Wallets
          </EndButton>
        </div>
      </Fragment>
    );
  }
}

export default Link;
