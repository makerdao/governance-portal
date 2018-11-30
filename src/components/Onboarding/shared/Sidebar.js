import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
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

import NetworkIndicator from '../../NetworkIndicator';
import { TransactionStatus } from '../../../utils/constants';
import WalletIcon from './WalletIcon';
import newTab from '../../../imgs/onboarding/newtab.svg';
import linkImg from '../../../imgs/onboarding/link.svg';
import logo from '../../../imgs/onboarding/maker-logomark.svg';

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

const GrayTag = ({ children, ...props }) => {
  return (
    <Box
      borderRadius="4px"
      display="inline-block"
      color="#868997"
      bg="#F5F5F5"
      fontWeight="bold"
      px="xs"
      {...props}
    >
      {children}
    </Box>
  );
};

const IconBackground = ({ children, ...props }) => {
  return (
    <Grid {...props}>
      <Flex
        alignItems="center"
        justifyContent="center"
        gridRow="1"
        gridColumn="1"
      >
        <Box
          borderRadius="50%"
          bg="#C4C4C4"
          opacity="0.2"
          style={{ width: '43px', height: '43px' }}
        />
      </Flex>
      <Flex
        gridRow="1"
        gridColumn="1"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Flex>
    </Grid>
  );
};

const Sidebar = ({
  show,
  faqs,
  network,
  hotWallet,
  coldWallet,
  initiateLinkTxHash,
  approveLinkTxHash,
  mkrApproveProxyTxHash,
  initiateLinkTxStatus,
  approveLinkTxStatus,
  mkrApproveProxyTxStatus
}) => {
  return (
    <Card p="m" gridRow="span -1">
      <Grid gridRowGap="l">
        {(hotWallet || coldWallet) && (
          <Grid gridTemplateColumns="auto 1fr" gridColumnGap="s">
            {hotWallet && (
              <React.Fragment>
                <IconBackground alignItems="center" minHeight="53px">
                  <WalletIcon
                    provider={hotWallet.type}
                    style={{ maxWidth: '23px', maxHeight: '23px' }}
                  />
                </IconBackground>
                <Flex justifyContent="center" flexDirection="column">
                  <Box color="#868997" fontSize="1rem" fontWeight="bold">
                    YOUR HOT WALLET
                  </Box>
                  <div>
                    <Link>
                      <Text t="p2" fontWeight="medium">
                        <Address shorten full={hotWallet.address} />
                      </Text>
                    </Link>
                  </div>
                  <Box fontSize="1rem" color="#868997">
                    {approveLinkTxHash &&
                      approveLinkTxStatus === TransactionStatus.MINED && (
                        <React.Fragment>
                          LINK APPROVED ON HW{' '}
                          <GrayTag>
                            TX{' '}
                            <Link>
                              <Address veryShort full={approveLinkTxHash} />
                            </Link>
                          </GrayTag>
                        </React.Fragment>
                      )}
                  </Box>
                </Flex>
              </React.Fragment>
            )}
            {coldWallet && (
              <React.Fragment>
                <Box alignItems="flex-start" justifySelf="center">
                  <img
                    src={linkImg}
                    alt=""
                    style={{ marginTop: '-6px', marginBottom: '-12px' }}
                  />
                </Box>
                <Box />
                <IconBackground alignItems="center" minHeight="53px">
                  <WalletIcon
                    provider={coldWallet.type}
                    style={{ maxWidth: '23px', maxHeight: '23px' }}
                  />
                </IconBackground>
                <Flex justifyContent="center" flexDirection="column">
                  <Box color="#868997" fontSize="1rem" fontWeight="bold">
                    YOUR COLD WALLET
                  </Box>
                  <Box>
                    <Link>
                      <Text t="p2" fontWeight="medium">
                        <Address shorten full={coldWallet.address} />
                      </Text>
                    </Link>
                  </Box>
                  <Box fontSize="1rem" color="#868997">
                    {initiateLinkTxHash &&
                      initiateLinkTxStatus === TransactionStatus.MINED && (
                        <React.Fragment>
                          LINK APPROVED ON CW{' '}
                          <GrayTag>
                            TX{' '}
                            <Link>
                              <Address veryShort full={initiateLinkTxHash} />
                            </Link>
                          </GrayTag>
                        </React.Fragment>
                      )}
                  </Box>
                </Flex>
              </React.Fragment>
            )}
            {coldWallet &&
              coldWallet.hasProxy &&
              coldWallet.proxy.hasInfMkrApproval && (
                <React.Fragment>
                  <Box
                    height="50px"
                    width="1px"
                    mr="-2px"
                    mt="-6px"
                    mb="-6px"
                    style={{ borderLeft: '2px dotted #30BD9F' }}
                    justifySelf="center"
                  />
                  <Box />
                  <IconBackground alignItems="center" minHeight="53px">
                    <img src={logo} alt="" />
                  </IconBackground>
                  <Flex justifyContent="center" flexDirection="column">
                    <Box color="#868997" fontSize="1rem" fontWeight="bold">
                      STORED MKR
                    </Box>
                    <div>
                      <Text t="p2" fontWeight="semibold">
                        {coldWallet.proxy.votingPower || 0} MKR
                      </Text>
                    </div>
                    <Box fontSize="1rem" color="#868997">
                      {mkrApproveProxyTxHash &&
                        mkrApproveProxyTxStatus === TransactionStatus.MINED && (
                          <React.Fragment>
                            APPROVED ON CW{' '}
                            <GrayTag>
                              TX{' '}
                              <Link>
                                <Address
                                  veryShort
                                  full={mkrApproveProxyTxHash}
                                />
                              </Link>
                            </GrayTag>
                          </React.Fragment>
                        )}
                    </Box>
                  </Flex>
                </React.Fragment>
              )}
          </Grid>
        )}
        <div>
          <NetworkIndicator network={network} mb="xs" fontWeight="medium" />
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

export default connect(
  ({ proxy, metamask }) => ({
    ...proxy,
    network: metamask.network
  }),
  {}
)(Sidebar);
