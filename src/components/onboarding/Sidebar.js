import React from 'react';
import styled from 'styled-components';
import {
  Box,
  Grid,
  Text,
  Card,
  Link,
  Table,
  Address
} from '@makerdao/ui-components';

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

const Sidebar = ({ show, faqs }) => {
  return (
    <Card p="m" gridColumn={['1', '1', '2']} gridRow="span -1">
      <Grid gridRowGap="s">
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
              <Text fontWeight="bold">{faq.title}</Text>
              <p>{faq.body}</p>
            </div>
          );
        })}
      </Grid>
    </Card>
  );
};

export default Sidebar;
