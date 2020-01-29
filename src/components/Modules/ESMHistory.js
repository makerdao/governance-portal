import React, { useState, useEffect } from 'react';
import { Card, Grid, Text, Table, Link } from '@makerdao/ui-components-core';
import { cutMiddle, formatDate, formatRound } from '../../utils/misc';
import { netIdToName, ethScanLink } from '../../utils/ethereum';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    (async () => {
      setRows(await window.maker.service('esm').getStakingHistory());
      setIsLoading(false);
    })();
  }, []);

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
                      {event.amount.gte(0.01)
                        ? formatRound(event.amount.toNumber())
                        : formatRound(event.amount.toNumber(), 6)}{' '}
                      MKR
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
