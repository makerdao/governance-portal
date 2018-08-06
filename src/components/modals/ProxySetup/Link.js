import React, { Fragment, Component } from 'react';
import differenceWith from 'ramda/src/differenceWith';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  StyledAnchor,
  InputLabels,
  EndButton,
  Note
} from '../shared/styles';
import Dropdown from '../../Dropdown';
import { AccountBlurb } from '../../AccountBox';
import { AccountTypes } from '../../../utils/constants';
import { eq } from '../../../utils/misc';

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

  render() {
    const validAccounts = this.props.accounts.filter(
      account => !account.hasProxy
    );
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
          Please connect your <StyledAnchor>cold wallet</StyledAnchor>; we
          support MetaMask, Ledger and Trezor. Then select the{' '}
          <StyledAnchor>hot wallet</StyledAnchor> you would like to link it to.
        </StyledBlurb>
        <Note>
          (feel free to change your metamask account while on this modal)
        </Note>

        <InputLabels>Select cold wallet</InputLabels>
        <Dropdown
          value={this.state.cold}
          onSelect={account => this.setState({ cold: account })}
          items={accountsMinusHot}
          itemKey="address"
          emptyMsg="no other not already linked accounts detected"
          renderItem={account => (
            <AccountBlurb
              noAddressCut
              type={account.type}
              address={account.address}
            />
          )}
        />
        <Note>This wallet must be connected.</Note>

        <InputLabels>Select hot wallet</InputLabels>
        <Dropdown
          value={this.state.hot}
          onSelect={account => this.setState({ hot: account })}
          items={accountsMinusCold}
          itemKey="address"
          renderItem={account => (
            <AccountBlurb
              noAddressCut
              type={account.type}
              address={account.address}
            />
          )}
        />
        <Note>This wallet will be able to vote with your MKR.</Note>
        <Note>
          (the first tx will be w/ your cold wallet,{' '}
          <strong style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
            please have it active
          </strong>)
        </Note>
        <Note>
          (if it's not active, nothing will happen when you click that button
          ¯\_(ツ)_/¯)
        </Note>
        <EndButton
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
      </Fragment>
    );
  }
}

export default Link;
