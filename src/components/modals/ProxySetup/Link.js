import React, { Fragment, Component } from 'react';
import differenceWith from 'ramda/src/differenceWith';
import styled from 'styled-components';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  TooltipCard,
  InputLabels,
  // StyledAnchor,
  EndButton,
  Dim,
  Note
} from '../shared/styles';
import Dropdown from '../../Dropdown';
import { AccountBlurb } from '../../AccountBox';
import { AccountTypes } from '../../../utils/constants';
import { eq } from '../../../utils/misc';

const EndRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Section = styled.div`
  margin-bottom: 16px;
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

  pickFromDropdown(choice, accountType) {
    switch (choice.address) {
      case 'connectTrezor':
        return this.props.connectTrezor();
      case 'connectLedger':
        return this.props.connectLedger();
      default:
    }

    this.ensureUniquePick(choice.address, accountType);
    this.setState({ [accountType]: choice });
  }

  ensureUniquePick(address, accountType) {
    const other = accountType === 'hot' ? 'cold' : 'hot';
    const currentPick = this.state[other];
    if (currentPick && currentPick.address === address) {
      const newPick = this.props.accounts
        .filter(a => !a.hasProxy)
        .find(a => a.address !== address);
      this.setState({ [other]: newPick });
    }
  }

  render() {
    const { hot, cold } = this.state;
    const { accounts } = this.props;

    const validAccounts = accounts
      .filter(account => !account.hasProxy)
      .concat([{ address: 'connectTrezor' }, { address: 'connectLedger' }]);

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
        <Section>
          <InputLabels>Select cold wallet</InputLabels>
          <AccountDropdown
            value={cold}
            onSelect={account => this.pickFromDropdown(account, 'cold')}
            items={validAccounts}
          />
          <Note style={{ opacity: '1' }}>
            <Dim>This wallet must be connected. How to connect</Dim>{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/watch?v=13UxGR5HxXE&index=3&list=PLLzkWCj8ywWP6yCPPm1IRKysNsrzg3LQ6"
            >
              MetaMask,
            </a>{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.youtube.com/watch?v=LyLxhbIMK8E&list=PLLzkWCj8ywWP6yCPPm1IRKysNsrzg3LQ6&index=2"
            >
              Ledger
            </a>{' '}
            <Dim>and</Dim>{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://medium.com/makerdao/the-makerdao-voting-proxy-contract-5765dd5946b4"
            >
              Trezor
            </a>
          </Note>
        </Section>
        <Section>
          <InputLabels>Select hot wallet</InputLabels>
          <AccountDropdown
            value={hot}
            onSelect={account => this.pickFromDropdown(account, 'hot')}
            items={validAccounts}
          />
          <Note>
            Reminder: this is the address that will be able to vote with your
            MKR.
          </Note>
        </Section>
        <EndRow>
          {/* <StyledAnchor blue>Read more about linking</StyledAnchor> */}
          <EndButton
            style={{ marginTop: '0', marginLeft: 'auto' }}
            disabled={!this.state.hot || !this.state.cold}
            slim
            onClick={() => this.props.initiateLink({ cold, hot })}
          >
            Link Wallets
          </EndButton>
        </EndRow>
      </Fragment>
    );
  }
}

export default Link;

const AccountDropdown = ({ value, onSelect, items }) => (
  <Dropdown
    value={value}
    onSelect={onSelect}
    items={items}
    itemKey="address"
    renderItem={renderAccountDropdownItem}
  />
);

function renderAccountDropdownItem(account) {
  switch (account.address) {
    case 'connectTrezor':
      return <span>Connect to Trezor</span>;
    case 'connectLedger':
      return <span>Connect to Ledger</span>;
    default:
      return (
        <AccountBlurb
          noAddressCut
          type={account.type}
          address={account.address}
        />
      );
  }
}
