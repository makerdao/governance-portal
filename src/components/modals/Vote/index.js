import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

import Card from "../../Card";
import Button from "../../Button";

import {
  StyledContainer,
  StyledCenter,
  StyledTitle,
  StyledBlurb,
  StyledTop,
  StyledAnchor,
  Styledinput
} from "../PoxySetup/style";

class Vote extends Component {
  state = {
    step: 1
  };

  nextStep = () => {
    this.setState(state => ({ step: state.step + 1 }));
  };

  renderStep() {
    switch (this.state.step) {
      case 1:
        const { proposal } = this.props.modalProps;
        return (
          <Fragment>
            <StyledTop>
              <StyledTitle>Confirmation</StyledTitle>
            </StyledTop>
            <StyledBlurb>
              You will be voting for{" "}
              <strong style={{ color: "#212536" }}>{proposal.title}</strong>{" "}
              please confirm vote below. Vote can be withdrawn at anytime
            </StyledBlurb>
            <div
              style={{
                margin: "auto",
                marginTop: "18px"
              }}
            >
              <Button
                slim
                onClick={() => this.props.sendVote(proposal.address)}
              >
                Confirm
              </Button>
            </div>
          </Fragment>
        );
      default:
        return null;
    }
  }
  // HANDLE ALL THE WAYS USERS COULD BE SILLY eg validate inputs, reject transaction, why did this tx fail
  render = () => (
    <Card maxWidth={600} background="white">
      <StyledContainer>
        <StyledCenter>{this.renderStep()}</StyledCenter>
      </StyledContainer>
    </Card>
  );
}

Vote.propTypes = {};

Vote.defaultProps = {};

export default Vote;
