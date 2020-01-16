import React from 'react';
import { Flex, Grid, Text, Link } from '@makerdao/ui-components-core';
import { connect } from 'react-redux';
import { getActiveAccount } from '../reducers/accounts';

import MKRBurn from '../components/Modules/MKRBurn';
import ESMHistory from '../components/Modules/ESMHistory';

const ESM = ({ activeAccount = {}, esm = {} } = {}) => {
  const { totalStaked } = esm;
  // console.log(esm, 'esm');

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Grid gridRowGap="m" mx={'2xl'} my={'2xl'} px={'2xl'}>
        <Text.h2 textAlign="left">Emergency Shutdown Module</Text.h2>
        <Text.p textAlign="justify">
          The ESM allows MKR holders to shutdown the system without a central
          authority. Once 50,000 MKR are entered into the ESM, emergency
          shutdown can be executed.{` `}
          <Link
            href="https://docs.makerdao.com/smart-contract-modules/emergency-shutdown-module"
            target="_blank"
            rel="noopener noreferrer"
            css="text-decoration: none"
          >
            Read the documentation here.
          </Link>
        </Text.p>
        <MKRBurn
          esmThresholdAmount={esm.thresholdAmount}
          account={activeAccount}
          totalMkrInEsm={totalStaked}
        />
        <ESMHistory />
      </Grid>
    </Flex>
  );
};

const reduxProps = ({ accounts, esm }) => {
  return {
    activeAccount: getActiveAccount({ accounts }),
    esm
  };
};

export default connect(reduxProps)(ESM);
