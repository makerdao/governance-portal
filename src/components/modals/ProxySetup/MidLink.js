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
import { getMkrBalance } from '../../../chain/read';
import { getBalance } from '../../../chain/web3';
import round from 'lodash.round';

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
