import React from 'react';
import { Flex, Grid, Text, Link } from '@makerdao/ui-components-core';

import MKRBurn from '../components/Modules/MKRBurn';
import ESMHistory from '../components/Modules/ESMHistory';

export default class ESM extends React.Component {
  render() {
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
