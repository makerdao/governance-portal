import React, { Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

const ModalCover = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  transform: translateZ(0);
  background-color: rgba(72, 73, 95, 0.3);
`;

const ModalBox = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5em 1.5em 1.5em 1.5em;
  background-color: #ffffff;
  border-radius: 4px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media screen and (min-width: 500px) {
    left: 50%;
    top: 50%;
    height: auto;
    transform: translate(-50%, -50%);
    max-width: 40em;
    max-height: calc(100% - 1em);
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5em;
  line-height: 1;
  border: 0;
  box-shadow: 0;
  cursor: pointer;
`;

const ModalCloseIcon = styled.svg`
  width: 21px;
  height: 21px;
  fill: rgba(#000, 0);
  stroke: black;
  stroke-linecap: round;
  stroke-width: 2;
`;

const ScreenReaderText = styled.span`
  border: 0 !important;
  clip: rect(0 0 0 0) !important;
  height: 1px !important;
  margin: -1px !important;
  overflow: hidden !important;
  padding: 0 !important;
  position: absolute !important;
  width: 1px !important;
  white-space: nowrap !important;
`;

const ModalBody = styled.div`
  padding-top: 0.25em;
`;

const ModalContent = ({
  content,
  componentProps,
  buttonRef,
  modalRef,
  onClose,
  onKeyDown,
  onClickAway,
  ariaLabel,
  role = 'dialog'
}) => {
  const contentProps = Object.assign({}, componentProps, { onClose });
  return createPortal(
    <ModalCover
      aria-label={ariaLabel}
      aria-modal="true"
      tabIndex="-1"
      role={role}
      onKeyDown={onKeyDown}
      onClick={onClickAway}
    >
      <ModalBox ref={modalRef}>
        <ModalClose
          onClick={onClose}
          aria-labelledby="close-modal"
          ref={buttonRef}
        >
          <ScreenReaderText id="close-modal">Close</ScreenReaderText>
          <ModalCloseIcon viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
          </ModalCloseIcon>
        </ModalClose>
        <ModalBody>{content(contentProps)}</ModalBody>
      </ModalBox>
    </ModalCover>,
    document.body
  );
};

export default class Modal extends Component {
  state = { isOpen: false };
  toggleScrollLock = () =>
    document.querySelector('html').classList.toggle('u-lock-scroll');
  onOpen = () => {
    this.setState({ isOpen: true }, () => {
      this.closeButtonNode.focus();
    });
    this.toggleScrollLock();
  };
  onClose = () => {
    this.setState({ isOpen: false });
    this.openButtonNode.focus();
    this.props.setStep(0);
    this.toggleScrollLock();
  };
  onKeyDown = ({ keyCode }) => keyCode === 27 && this.onClose();
  onClickAway = e => {
    if (this.modalNode && this.modalNode.contains(e.target)) return;
    this.onClose();
  };

  render() {
    const { isOpen } = this.state;
    const { triggerText, ariaLabel, role, ModalTrigger, children } = this.props;
    return (
      <Fragment>
        {
          <ModalTrigger
            text={triggerText}
            onOpen={this.onOpen}
            buttonRef={n => (this.openButtonNode = n)}
          />
        }
        {isOpen && (
          <ModalContent
            onClose={this.onClose}
            onKeyDown={this.onKeyDown}
            onClickAway={this.onClickAway}
            ariaLabel={ariaLabel}
            modalRef={n => (this.modalNode = n)}
            buttonRef={n => (this.closeButtonNode = n)}
            role={role}
            componentProps={this.props}
            content={props => children(props)}
          />
        )}
      </Fragment>
    );
  }
}
