import React, { Component, Fragment, useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Text
} from '@makerdao/ui-components-core';

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

const ModalTrigger = ({ text }) => (
  <Button variant="danger-outline">{text}</Button>
);
const ModalContent = ({ content }) => {
  return (
    <ModalCover>
      <Modal>
        <ModalClose>
          <ScreenReaderText>Close</ScreenReaderText>
          <ModalCloseIcon viewBox="0 0 40 40">
            <path d="M 10,10 L 30,30 M 30,10 L 10,30"></path>
          </ModalCloseIcon>
        </ModalClose>
        <ModalBody></ModalBody>
      </Modal>
    </ModalCover>
  );
};

const BurnMKRModal = props => {
  const { triggerText } = props;
  return (
    <Fragment>
      <ModalTrigger text={triggerText} />
      <ModalContent />
    </Fragment>
  );
};

export default () => {
  const modalProps = {
    triggerText: 'Burn your MKR'
  };
  const [mkrStaked, setMkrStaked] = useState('0.00');
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        Total MKR Burned
      </Text.h4>
      <Card>
        <CardBody p={'s'} pb={'m'}>
          <Flex flexDirection="row" m={'s'}>
            {/* Load Number */}
            <Text.h3>
              {`${mkrStaked} MKR `}
              {` `}
            </Text.h3>
            <Text.p color="#708390" ml="xs" fontWeight="400">
              {' '}
              of 50,000 MKR
            </Text.p>
          </Flex>
          <Box
            flexGrow="1"
            bg="#F6F8F9"
            border="default"
            height="20"
            mx="s"
            my="s"
            mb="m"
            style={{ borderRadius: 5, minHeight: 20 }}
          ></Box>
        </CardBody>
        <CardBody>
          <Flex flexDirection="row" justifyContent="space-between" m={'m'}>
            <BurnMKRModal {...modalProps} />
            <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
              You have no MKR in the ESM
            </Text.p>
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};
