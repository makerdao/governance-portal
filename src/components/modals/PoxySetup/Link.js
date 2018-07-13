import React, { Fragment, Component } from "react";

import {
  StyledContainer,
  StyledCenter,
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Column,
  StyledAnchor,
  CircledNum,
  Section,
  GuideWrapper,
  Guide,
  GuideTitle,
  GuideInfo,
  SetupLater,
  InfoBox,
  InfoBoxSection,
  InfoBoxHeading,
  InfoBoxContent,
  ProgressTabsWrapper,
  TabsTitle,
  TabsTitleWrapper,
  TxHash,
  Styledinput
} from "./style";
import Button from "../../Button";
import ProgressTabs from "./ProgressTabs";

class Link extends Component {
  state = {
    hot: "",
    cold: ""
  };

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
          Please connect your <StyledAnchor>cold wallet</StyledAnchor> , we
          support MetaMask, Ledger and Trezor. Then select the{" "}
          <StyledAnchor>hot wallet</StyledAnchor> you would like to link it to.
        </StyledBlurb>
        <Styledinput
          value={this.state.cold}
          onChange={this.updateInputValueCold}
          placeholder="Cold wallet"
        />
        <Styledinput
          value={this.state.hot}
          onChange={this.updateInputValueHot}
          placeholder="Hot wallet"
        />
        <div
          style={{
            alignSelf: "center",
            marginTop: "18px"
          }}
        >
          <Button
            slim
            // onClick={this.props.createProxy({
            //   hot: this.state.hot,
            //   cold: this.state.cold
            // })}
          >
            Link Wallets
          </Button>
        </div>
      </Fragment>
    );
  }
}

export default Link;
