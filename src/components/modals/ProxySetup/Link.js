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
import ProgressTabs from './ProgressTabs';
import Dropdown from '../../Dropdown';
import { AccountBlurb } from '../../AccountBox';
import { AccountTypes } from '../../../utils/constants';

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
        (a, b) => a.address === b.address,
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
    // TODO: const ok = cold and hot are valid addresses - disable button otherwise
    // TODO: show only valid addresses for each dropdown (i.e. unlinked)
    return (
      <Fragment>
        <ProgressTabs progress={1} />
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
          items={this.props.accounts}
          itemKey="address"
          renderItem={account => (
            <AccountBlurb type={account.type} address={account.address} />
          )}
        />
        <Note>
          This wallet must be connected.{' '}
          <a onClick={this.props.trezorConnectInit}>Connect to Trezor</a>
        </Note>

        <InputLabels>Select hot wallet</InputLabels>
        <Dropdown
          value={this.state.hot}
          onSelect={account => this.setState({ hot: account })}
          items={this.props.accounts}
          itemKey="address"
          renderItem={account => (
            <AccountBlurb type={account.type} address={account.address} />
          )}
        />
        <Note>This wallet will be able to vote with your MKR.</Note>
        <Note>
          (the first tx will be w/ your cold wallet, please have it active)
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
