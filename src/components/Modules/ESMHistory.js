import React from 'react';
import { Card, Grid, Text, Table, Link } from '@makerdao/ui-components-core';
import { MKR } from '../../chain/maker';
import { cutMiddle, formatDate, formatRound } from '../../utils/misc';
import { netIdToName, ethScanLink } from '../../utils/ethereum';

export default () => {
  const mockSDKStakeHistory = [
    {
      senderAddress: '0x14341f81df14ca86e1420ec9e6abd343fb1c5bfc',
      transactionHash:
        '0x6cead96909408284c77dca7a96c18df75c3f0c0eb6e972c2c0fb84f569648bfe',
      amount: MKR(0.01),
      time: new Date('2020-01-10T00:16:16+00:00')
    },
    {
      senderAddress: '0x16fb96a5fa0427af0c8f7cf1eb4870231c8154b6',
      transactionHash:
        '0x992dc7815d91eedb691ff4a7192bafc79f624534655ee0663c555252f9e48e22',
      amount: MKR(49000),
      time: new Date('2019-11-13T15:03:28+00:00')
    }
  ];
  const rows = mockSDKStakeHistory;
  const isLoading = false;
  return (
    <Grid gridRowGap="m" my={'s'}>
      <Text.h4 textAlign="left" fontWeight="700">
        ESM History
      </Text.h4>
      <Card p={'s'} pb={'m'}>
        <Table
          width="100%"
          variant="normal"
          css={`
            td,
            th {
              padding-right: 10px;
            }
          `}
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount Staked</th>
              <th>Sender Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr key={0}>
                <td colSpan="3">
                  <Text color="darkLavender" t="caption">
                    Loading
                  </Text>
                </td>
              </tr>
            ) : rows && rows.length > 0 ? (
              rows.map((event, i) => (
                <tr key={i}>
                  <td
                    css={`
                      white-space: nowrap;
                      max-width: 205px;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {formatDate(event.time)}
                    </Text>
                  </td>
                  <td
                    css={`
                      white-space: nowrap;
                    `}
                  >
                    <Text color="darkLavender" t="caption">
                      {formatRound(event.amount.toNumber())} MKR
                    </Text>
                  </td>
                  <td>
                    <Link
                      href={ethScanLink(
                        event.transactionHash,
                        netIdToName(window.maker.service('web3').networkId())
                      )}
                      target="_blank"
                      t="caption"
                      color="blue"
                    >
                      {cutMiddle(event.senderAddress, 8, 6)}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr key={0}>
                <td colSpan="3">
                  <Text color="darkLavender" t="caption">
                    No history to show
                  </Text>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </Grid>
  );
};
