import React, { Component } from "react";
// import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";

// import Column from "../components/Column";
import { modalClose } from "../../reducers/modal";
import ProxySetup from "./ProxySetup";
import close from "../../assets/close.svg";

import { colors, transitions } from "../../styles";

const StyledColumn = styled.div`
  position: relative;
  width: 100%;
  height: ${({ spanHeight }) => (spanHeight ? "100%" : "auto")};
  max-width: ${({ maxWidth }) => `${maxWidth}px`};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ center }) => (center ? "center" : "flex-start")};
`;

const Column = ({ children, spanHeight, maxWidth, center, ...props }) => (
  <StyledColumn
    spanHeight={spanHeight}
    maxWidth={maxWidth}
    center={center}
    {...props}
  >
    {children}
  </StyledColumn>
);

const StyledLightbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  transition: ${transitions.base};
  opacity: ${({ modal }) => (modal ? 1 : 0)};
  visibility: ${({ modal }) => (modal ? "visible" : "hidden")};
  pointer-events: ${({ modal }) => (modal ? "auto" : "none")};
  background: rgba(${colors.dark}, 0.2);
`;

const StyledHitbox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledClose = styled.div`
  height: 36px;
  width: 36px;
  margin-left: auto;
  margin-top: -8px;
  margin-bottom: 8px;
  cursor: pointer;
  background: url(${close}) no-repeat;
`;

const ModalTopper = styled.div`
  width: 600px;
`;

class Modal extends Component {
  modalController = () => {
    switch (this.props.modal) {
      case "PROXY_SETUP":
        return <ProxySetup />;
      default:
        return <div />;
    }
  };

  render = () => {
    // const body = document.body || document.getElementsByTagName("body")[0];

    // if (this.props.modal) {
    //   body.style.overflow = "hidden";
    // } else {
    //   body.style.overflow = "auto";
    // }

    return (
      <StyledLightbox modal={this.props.modal}>
        <StyledContainer>
          <StyledHitbox onClick={this.props.modalClose} />
          <Column center>
            <ModalTopper>
              <StyledClose onClick={this.props.modalClose} />
            </ModalTopper>
            {this.modalController()}
          </Column>
        </StyledContainer>
      </StyledLightbox>
    );
  };
}

Modal.propTypes = {};

const reduxProps = ({ modal }) => ({ modal: modal.modal });

export default connect(
  reduxProps,
  { modalClose }
)(Modal);
