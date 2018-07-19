import React, { Fragment, Component } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  StyledAnchor,
  StyledInput,
  InputLabels,
  Note
} from '../shared/styles';
import Button from '../../Button';
import ProgressTabs from './ProgressTabs';

class Link extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hot: '',
      cold: props.activeAccount.address
    };
  }

  componentDidUpdate(prev) {
    if (prev.activeAccount.address !== this.props.activeAccount.address)
      this.setState({ cold: this.props.activeAccount.address });
  }

  updateInputValueHot = evt => {
    this.setState({ hot: evt.target.value });
  };

  updateInputValueCold = evt => {
    this.setState({ cold: evt.target.value });
  };

  render() {
    // TODO: const ok = cold and hot are valid addresses - disable button otherwise
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
        <InputLabels>Select cold wallet</InputLabels>
        <StyledInput
          value={this.state.cold}
          onChange={this.updateInputValueCold}
          placeholder="Cold wallet"
          readOnly
        />
        <Note>^ forced to be current active account for now</Note>

        <InputLabels>Select hot wallet</InputLabels>
        <StyledInput
          value={this.state.hot}
          onChange={this.updateInputValueHot}
          placeholder="Hot wallet"
        />
        <Note>This wallet must be connected.</Note>
        <div
          style={{
            alignSelf: 'center',
            marginTop: '18px'
          }}
        >
          <Button
            slim
            onClick={() =>
              this.props.initiateLink({
                coldAccount: this.props.activeAccount,
                hotAddress: this.state.hot
              })
            }
          >
            Link Wallets
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Link;
