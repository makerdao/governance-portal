import React, { useState } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Text,
  Link
} from '@makerdao/ui-components-core';

import Loader from '../components/Loader';

const MKRBurn = () => {
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
            <Button variant="danger-outline">Burn your MKR</Button>
            <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
              You have no MKR in the ESM
            </Text.p>
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};

const ESMHistory = () => {
  const [stakingHistory, setStakingHistory] = useState(false);
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        ESM History
      </Text.h4>
      <Card>
        {!stakingHistory ? (
          <Text.p
            color="#9FAFB9"
            fontWeight="300"
            alignSelf="center"
            p={'xl'}
            textAlign="center"
          >
            No history to show
          </Text.p>
        ) : null}
      </Card>
    </Grid>
  );
};
export default class Dropdown extends React.Component {
  state = {
    esmCliDocContent: null
  };

  componentDidMount() {
    fetch(require('../esCliDoc.md'))
      .then(res => res.text())
      .then(esmCliDocContent => this.setState({ esmCliDocContent }));
  }

  render() {
    const { esmCliDocContent } = this.state;
    return (
      <Flex flexDirection="column" minHeight="100vh">
        <Grid gridRowGap="m" mx={'2xl'} my={'2xl'} px={'2xl'}>
          <Text.h2 textAlign="left">Emergency Shutdown Module</Text.h2>
          <Text.p textAlign="justify">
            The ESM allows MKR holders to shutdown the system without a central
            authority. Once 50,000 MKR are entered into the ESM, emergency
            shutdown can be executed.
            {` `}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              css="text-decoration: none"
            >
              Read the documentation here.
            </Link>
          </Text.p>
          <MKRBurn />
          <ESMHistory />
        </Grid>
      </Flex>
    );
  }
}
