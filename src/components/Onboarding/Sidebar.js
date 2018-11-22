import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Flex,
  Grid,
  Text,
  Card,
  Link,
  Table,
  Address
} from '@makerdao/ui-components';

import WalletIcon from './WalletIcon';
import newTab from '../../imgs/onboarding/newtab.svg';

const ExternalLink = styled(Link)`
  position: relative;
  &:after {
    margin-left: 0.5rem;
    content: '';
    position: absolute;
    top: calc(50% - 4px);
    bottom: 0;
    mask: url(${newTab}) no-repeat center center;
    height: 8px;
    width: 8px;
    background-color: currentColor;
  }
`;

const Sidebar = ({ show, faqs, hotWallet }) => {
  return (
    <Card p="m" gridColumn={['1', '1', '2']} gridRow="span -1">
      <Grid gridRowGap="m">
        {hotWallet && (
          <Grid gridTemplateColumns="auto 1fr" gridColumnGap="s">
            <Flex
              alignItems="center"
              justifyContent="center"
              gridRow="1/3"
              gridColumn="1"
            >
              <Box
                borderRadius="50%"
                bg="#C4C4C4"
                opacity="0.2"
                style={{ width: '34px', height: '34px' }}
              />
            </Flex>
            <Flex
              gridRow="1/3"
              gridColumn="1"
              alignItems="center"
              justifyContent="center"
            >
              <WalletIcon
                provider={hotWallet.type}
                style={{ maxWidth: '23px', maxHeight: '23px' }}
              />
            </Flex>
            <Box gridColumn="2">
              <Text color="#868997" fontSize="1rem" fontWeight="bold">
                YOUR HOT WALLET
              </Text>
            </Box>
            <Box gridColumn="2">
              <Link>
                <Text t="p2" fontWeight="medium">
                  <Address shorten full={hotWallet.address} />
                </Text>
              </Link>
            </Box>
          </Grid>
        )}
        <div>
          <Text fontWeight="bold">Ethereum Mainnet</Text>
          <Box fontSize="1.5rem" color="#868997">
            <Table width="100%" variant="cozy">
              <tbody>
                <tr>
                  <td>Contract 1</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td>Contract 2</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td>Contract 3</td>
                  <td>
                    <ExternalLink>
                      <Address
                        full="0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2"
                        show={show}
                        shorten
                      />
                    </ExternalLink>
                  </td>
                </tr>
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>Source code</td>
                  <td
                    style={{
                      maxWidth: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    <ExternalLink
                      style={{ whiteSpace: 'nowrap' }}
                      href="https://github.com/makerdao/governance-dashboard"
                    >
                      https://github.com/makerdao/governance-dashboard
                    </ExternalLink>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Box>
        </div>
        {(faqs || []).map(faq => {
          return (
            <div key={faq.title}>
              <Box mb="xs">
                <Text fontWeight="bold">{faq.title}</Text>
              </Box>
              <p>{faq.body}</p>
            </div>
          );
        })}
      </Grid>
    </Card>
  );
};

export default Sidebar;
