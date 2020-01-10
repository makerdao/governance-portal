import React, { Fragment, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Button } from '@makerdao/ui-components-core';

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

const Modal = styled.div`
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
    max-width: 30em;
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

const ModalTrigger = ({ text, onOpen }) => (
  <Button variant="danger-outline" onClick={onOpen}>
    {text}
  </Button>
);

const ModalContent = ({ content, onClose }) => {
  return createPortal(
    <ModalCover>
      <Modal>
        <ModalClose onClick={onClose}>
          <ScreenReaderText>Close</ScreenReaderText>
          <ModalCloseIcon viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
          </ModalCloseIcon>
        </ModalClose>
        <ModalBody></ModalBody>
      </Modal>
    </ModalCover>,
    document.body
  );
};

export default props => {
  const { triggerText } = props;
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  return (
    <Fragment>
      <ModalTrigger text={triggerText} onOpen={onOpen} />
      {isOpen && <ModalContent onClose={onClose} />}
    </Fragment>
  );
};
