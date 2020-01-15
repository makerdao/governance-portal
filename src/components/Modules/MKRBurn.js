import React from 'react';
import Loader from '../Loader';
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

const Filler = styled.div`
  border-radius: inherit;
  height: 100%;
  transition: width 0.2s ease-in;
  background-color: #f75625;
  min-height: 20px;
`;

export default ({ totalMkrInEsm, accountMkrInEsm, esmThresholdAmount }) => {
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        Total MKR Burned
      </Text.h4>
      <Card>
        <CardBody p={'s'} pb={'m'}>
          <Flex flexDirection="row" m={'s'}>
            <Text.h3>
              {totalMkrInEsm ? (
                totalMkrInEsm.toString()
              ) : (
                <Box pl="14px" pr="14px">
                  <Loader size={20} color="header" background="white" />
                </Box>
              )}
            </Text.h3>
            <Text.p color="#708390" ml="xs" fontWeight="400">
              {' '}
              of {esmThresholdAmount ? esmThresholdAmount.toString() : '---'}
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
          >
            <Filler
              style={{
                width: totalMkrInEsm
                  ? `${
                      totalMkrInEsm.gt(esmThresholdAmount)
                        ? '100'
                        : totalMkrInEsm
                            .times(100)
                            .div(esmThresholdAmount)
                            .toFixed()
                    }%`
                  : '0%'
              }}
            />
          </Box>
        </CardBody>
        <CardBody>
          <Flex flexDirection="row" justifyContent="space-between" m={'m'}>
            <Button variant="danger-outline">Burn your MKR</Button>
            <Text.p color="#9FAFB9" fontWeight="300" alignSelf="center">
              {accountMkrInEsm && accountMkrInEsm.gt(0) ? (
                <Box>
                  You burned{' '}
                  <strong style={{ fontWeight: 'bold' }}>
                    {accountMkrInEsm.toString()}
                  </strong>{' '}
                  in the ESM
                </Box>
              ) : (
                'You have no MKR in the ESM'
              )}
            </Text.p>
          </Flex>
        </CardBody>
      </Card>
    </Grid>
  );
};
