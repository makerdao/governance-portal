import React from 'react';
import { Flex, Grid, Text, Link } from '@makerdao/ui-components-core';
import { connect } from 'react-redux';
import moment from 'moment';
import { getActiveAccount } from '../reducers/accounts';

import MKRBurn from '../components/Modules/MKRBurn';
import ESMHistory from '../components/Modules/ESMHistory';

const ESM = ({ activeAccount = {}, esm = {} } = {}) => {
  const { totalStaked, thresholdAmount, fired, canFire, cageTime } = esm;
  const time = cageTime === 0 ? cageTime : cageTime.toNumber();
  const formattedTime = moment.utc(time).format('do MMMM YYYY hh:mm');
  return (
    <Flex flexDirection="column" minHeight="100vh">
      {time ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          border={'1px solid #F77249'}
          style={{ backgroundColor: '#FDEDE8' }}
          mt={'l'}
          borderRadius={'6'}
        >
          <Text
            my="s"
            style={{ textAlign: 'center', fontSize: 14, color: '#994126' }}
          >
            {`Emergency shutdown has been initiated on ${formattedTime} UTC. This dashboard is currently read-only.`}
            <br />
          </Text>
        </Flex>
      ) : null}
      <Grid gridRowGap="m" mx={'2xl'} my={'2xl'} px={'2xl'}>
        <Text.h2 textAlign="left">Emergency Shutdown Module</Text.h2>
        <Text.p>
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
          esmThresholdAmount={thresholdAmount}
          initiated={fired}
          canInitiate={canFire}
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
