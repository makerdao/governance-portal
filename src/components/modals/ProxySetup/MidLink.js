import React, { Fragment, Component } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Skip,
  EndButton,
  FlexRowEnd
} from '../shared/styles';
import HotColdTable from '../shared/HotColdTable';
import { formatRound, toNum } from '../../../utils/misc';
import maker, { MKR, ETH } from '../../../chain/maker';

class MidLink extends Component {
  constructor(props) {
    super(props);
    const zero = 0;
    this.state = {
      ethHot: zero.toFixed(3),
      ethCold: zero.toFixed(3),
      mkrHot: zero.toFixed(3),
      mkrCold: zero.toFixed(3)
    };
  }

  async componentDidMount() {
    const { hotAddress, coldAddress } = this.props;
    const mkrToken = maker.getToken(MKR);
    const ethToken = maker.getToken(ETH);
    const [ethHot, ethCold, mkrHot, mkrCold] = await Promise.all([
      ethToken.balanceOf(hotAddress),
      ethToken.balanceOf(coldAddress),
      mkrToken.balanceOf(hotAddress),
      mkrToken.balanceOf(coldAddress)
    ]);
    this.setState({
      ethHot: formatRound(ethHot.toNumber(), 3),
      ethCold: formatRound(ethCold.toNumber(), 3),
      mkrHot: formatRound(mkrHot.toNumber(), 3),
      mkrCold: formatRound(mkrCold.toNumber(), 3)
    });
  }

  render() {
    const {
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
          The below addresses will be linked. You may undo this at anytime.
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
