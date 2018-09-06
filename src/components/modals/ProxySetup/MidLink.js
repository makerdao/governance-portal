import React, { Fragment, Component } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Oblique,
  Bold,
  Skip,
  EndButton,
  FlexRowEnd
} from '../shared/styles';
import Button from '../../Button';
import { HotColdTable } from '../BreakLink';
import { getMkrBalance } from '../../../chain/read';
import { getBalance } from '../../../chain/web3';
import round from 'lodash.round';

class MidLink extends Component {
  constructor(props) {
    super(props);
    this.state = { ethHot: 0, ethCold: 0, mkrHot: 0, mkrCold: 0 };
  }

  async componentDidMount() {
    const { hotAddress, coldAddress } = this.props;
    const [ethHot, ethCold, mkrHot, mkrCold] = await Promise.all([
      getBalance(hotAddress, 3),
      getBalance(coldAddress, 3),
      getMkrBalance(hotAddress, 3),
      getMkrBalance(coldAddress, 3)
    ]);
    this.setState({
      ethHot: round(ethHot, 3),
      ethCold: round(ethCold, 3),
      mkrHot: round(mkrHot, 3),
      mkrCold: round(mkrCold, 3)
    });
  }

  render() {
    const {
      account,
      hotAddress,
      coldAddress,
      proxyClear,
      goToStep,
      nextStep
    } = this.props;
    return (
      <Fragment>
        <StyledTop>
          <StyledTitle>You've initiated the following link</StyledTitle>
        </StyledTop>
        <StyledBlurb style={{ textAlign: 'center' }}>
          The below addresses will be linked
        </StyledBlurb>
        <HotColdTable
          hotAddress={hotAddress}
          coldAddress={coldAddress}
          mkrBalanceHot={this.state.mkrHot}
          mkrBalanceCold={this.state.mkrCold}
          ethBalanceHot={this.state.ethHot}
          ethBalanceCold={this.state.ethCold}
        />
        <FlexRowEnd>
          <Skip
            mr={24}
            mt={24}
            onClick={() => {
              localStorage.clear();
              goToStep('intro');
              proxyClear();
            }}
          >
            Start over
          </Skip>
          <EndButton
            slim
            onClick={() => {
              nextStep();
            }}
          >
            Approve
          </EndButton>
        </FlexRowEnd>
      </Fragment>
    );
  }
}

export default MidLink;
