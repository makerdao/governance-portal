import React from 'react';
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
import ExternalLink from './ExternalLink';
import { DataLabel, SubtitleDataLabel } from '../../../utils/typography';
import { GreyTag } from './Tags';
import linkImg from '../../../imgs/onboarding/link.svg';
import logo from '../../../imgs/onboarding/maker-logomark.svg';

const iconBackgroundSize = '4.3rem';
const iconSize = '2.3rem';
const connectingLineHeight = '5rem';

const contractAddresses = [
  {
    name: 'Contract 1',
    address: '0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2'
  },
  {
    name: 'Contract 2',
    address: '0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2'
  },
  {
    name: 'Contract 3',
    address: '0x99cb784f0429efd72wu39fn4256n8wud4e01c7d2'
  }
];

const IconBackground = ({ children, ...props }) => {
  return (
    <Grid alignItems="center" {...props}>
      <Flex
        alignItems="center"
        justifyContent="center"
        gridRow="1"
        gridColumn="1"
      >
        <Box
          borderRadius="50%"
          bg="greys.veryLight"
          width={iconBackgroundSize}
          height={iconBackgroundSize}
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

const ConnectingLine = ({ lineStyle = 'solid', ...props }) => (
  <Box
    gridColumn="1"
    height={`calc(100% - ${iconBackgroundSize})`}
    width="2px"
    borderRight={`2px ${lineStyle}`}
    ml="-1px"
    borderColor="makerTeal"
    alignSelf="center"
    justifySelf="center"
    {...props}
  />
);

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
                <IconBackground gridColumn="1" gridRow="1" zIndex="1">
                  <WalletIcon
                    provider={hotWallet.type}
                    style={{ maxWidth: iconSize, maxHeight: iconSize }}
                  />
                </IconBackground>
                <Flex justifyContent="center" flexDirection="column">
                  <DataLabel>YOUR HOT WALLET</DataLabel>
                  <div>
                    <Link>
                      <Text t="p2" fontWeight="medium">
                        <Address shorten full={hotWallet.address} />
                      </Text>
                    </Link>
                  </div>
                  <SubtitleDataLabel>
                    {approveLinkTxHash &&
                      approveLinkTxStatus === TransactionStatus.MINED && (
                        <Flex>
                          <p>LINK APPROVED ON HW </p>
                          <GreyTag>
                            TX{' '}
                            <Link>
                              <Address veryShort full={approveLinkTxHash} />
                            </Link>
                          </GreyTag>
                        </Flex>
                      )}
                  </SubtitleDataLabel>
                </Flex>
              </React.Fragment>
            )}
            {coldWallet && (
              <React.Fragment>
                <Box
                  alignItems="flex-start"
                  justifySelf="center"
                  lineHeight="0"
                  gridColumn="1"
                  gridRow="2"
                  zIndex="1"
                >
                  <img src={linkImg} alt="" />
                </Box>
                <Box />
                <IconBackground gridColumn="1" gridRow="3" zIndex="1">
                  <WalletIcon
                    provider={coldWallet.type}
                    style={{ maxWidth: iconSize, maxHeight: iconSize }}
                  />
                </IconBackground>
                <Flex justifyContent="center" flexDirection="column">
                  <Box color="grey" fontSize="1rem" fontWeight="bold">
                    YOUR COLD WALLET
                  </Box>
                  <Box>
                    <Link>
                      <Text t="p2" fontWeight="medium">
                        <Address shorten full={coldWallet.address} />
                      </Text>
                    </Link>
                  </Box>
                  <SubtitleDataLabel>
                    {initiateLinkTxHash &&
                      initiateLinkTxStatus === TransactionStatus.MINED && (
                        <Flex>
                          <p>LINK APPROVED ON CW </p>
                          <GreyTag>
                            TX{' '}
                            <Link>
                              <Address veryShort full={initiateLinkTxHash} />
                            </Link>
                          </GreyTag>
                        </Flex>
                      )}
                  </SubtitleDataLabel>
                </Flex>
                <ConnectingLine gridRow="1/span 3" />
              </React.Fragment>
            )}
            {coldWallet &&
              coldWallet.hasProxy &&
              coldWallet.proxy.hasInfMkrApproval && (
                <React.Fragment>
                  <ConnectingLine
                    gridColumn="1"
                    gridRow="3/span 3"
                    lineStyle="dotted"
                  />
                  <Box gridRow="4" height={connectingLineHeight} />
                  <IconBackground gridColumn="1" gridRow="5">
                    <img src={logo} alt="" />
                  </IconBackground>
                  <Flex justifyContent="center" flexDirection="column">
                    <DataLabel>STORED MKR</DataLabel>
                    <div>
                      <Text t="p2" fontWeight="semibold">
                        {coldWallet.proxy.votingPower || 0} MKR
                      </Text>
                    </div>
                    <SubtitleDataLabel>
                      {mkrApproveProxyTxHash &&
                        mkrApproveProxyTxStatus === TransactionStatus.MINED && (
                          <p>
                            APPROVED ON CW{' '}
                            <GreyTag>
                              TX{' '}
                              <Link>
                                <Address
                                  veryShort
                                  full={mkrApproveProxyTxHash}
                                />
                              </Link>
                            </GreyTag>
                          </p>
                        )}
                    </SubtitleDataLabel>
                  </Flex>
                </React.Fragment>
              )}
          </Grid>
        )}
        <div>
          <NetworkIndicator network={network} mb="xs" fontWeight="medium" />
          <Box fontSize="1.5rem" color="grey">
            <Table width="100%" variant="cozy">
              <tbody>
                {contractAddresses.map(({ name, address }) => (
                  <tr key={name + address}>
                    <td>{name}</td>
                    <td>
                      <ExternalLink>
                        <Address full={address} shorten />
                      </ExternalLink>
                    </td>
                  </tr>
                ))}
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
