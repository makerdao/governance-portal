import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

import { Button } from '@makerdao/ui-components';

import VoterStatus from '../components/VoterStatus';
import Card from '../components/Card';
import Timer from '../components/Timer';
import ClosedStatus from '../components/ClosedStatus';
import { toSlug, eq, formatDate, formatRound } from '../utils/misc';
import theme, { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import Vote from '../components/modals/Vote';
import TillHat from '../components/TillHatMeta';
import ExtendedLink from '../components/Onboarding/shared/ExtendedLink';
import { Banner, BannerBody, BannerContent } from '../components/Banner';
import { poll } from 'ethers/utils/web';

const riseUp = keyframes`
0% {
  opacity: 0;
  transform: translateY(15px);
}
100% {
  opacity: 1;
  transform: translateY(0);
}
`;

const RiseUp = styled.div`
  animation: ${riseUp} 0.75s ease-in-out;
`;

const SubHeading = styled.p`
  color: ${theme.text.darker_default};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
`;

const TopicSubHeading = styled(SubHeading)`
  margin-bottom: 30px;
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  height: 52px;
  color: #546978;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-around;
`;

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;
const StyledButton = styled(Button)`
  position: absolute;
  top: 16%;
  right: 2%;
`;

const Tag = styled.p`
  padding: 1px 10px;
  border-radius: 4px;
  line-height: 21px;
  font-weight: bold;
  font-size: 14px;
  align-self: center;
  margin: auto;
  display: inline-block;
  margin-left: ${({ ml }) => (ml ? `${ml}px` : '')};
  background-color: ${({ green }) => (green ? '#c3f5ea' : '#FFE2D9')};
  color: ${({ green }) => (green ? '#30BD9F' : '#E45432')};
`;

const Content = styled.div`
  display: flex;
`;

const proposalWrapperHeight = 200;

const BannerLink = styled.a`
  color: #ffffff;
  text-decoration: underline;
  font-weight: bold;
`;

const HIDE_MIGRATION_BANNER_KEY = 'hide-migration-banner-0.1.0';

const hasHiddenMigrationBanner = JSON.parse(
  localStorage.getItem(HIDE_MIGRATION_BANNER_KEY)
);

class MigrationNotificationBanner extends React.Component {
  state = {
    show: !hasHiddenMigrationBanner
  };

  hide = () => {
    this.setState({ show: false });
    localStorage.setItem(HIDE_MIGRATION_BANNER_KEY, 'true');
  };

  render() {
    if (!this.state.show) return null;
    return (
      <Banner
        backgroundColor="#E8643F"
        border="none"
        style={{ position: 'relative' }}
      >
        <div
          onClick={this.hide}
          style={{
            color: 'white',
            position: 'absolute',
            top: '0px',
            right: '8px',
            fontSize: '18px',
            cursor: 'pointer'
          }}
        >
          ×
        </div>
        <Content>
          <BannerBody color="#FFFFFF">
            <BannerContent style={{ fontSize: '17px' }}>
              {/* <Flex>
                <NotificationIcon />
              </Flex> */}
              ROUTING TEST{' '}
              <BannerLink
                href="https://migrate.makerdao.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                migrate.makerdao.com
              </BannerLink>{' '}
              to withdraw your MKR from the old system. This interface is using
              the new{' '}
              <BannerLink
                target="_blank"
                rel="noopener noreferrer"
                href="https://etherscan.io/address/0x9ef05f7f6deb616fd37ac3c959a2ddd25a54e4f5"
              >
                DSChief
              </BannerLink>{' '}
              and{' '}
              <BannerLink
                target="_blank"
                rel="noopener noreferrer"
                href=" https://etherscan.io/address/0x868ba9aeacA5B73c7C27F3B01588bf4F1339F2bC"
              >
                Vote Proxy{' '}
              </BannerLink>
              contracts deployed on May 6 2019.
            </BannerContent>
          </BannerBody>
        </Content>
      </Banner>
    );
  }
}

const PollingList = ({
  modalOpen,
  proposals,
  canVote,
  fetching,
  votingFor,
  signaling,
  hat,
  approvals,
  polls
}) => {
  polls.sort((a, b) => b.startTime - a.startTime);
  return (
    <Fragment>
      <MigrationNotificationBanner />
      <VoterStatus signaling={signaling} />
      <RiseUp key={polls.toString()}>
        {polls.map(poll => (
          <StyledCard key={poll.voteId}>
            <Card.Element key={poll.voteId} height={proposalWrapperHeight}>
              <ProposalDetails>
                <ExtendedLink to={`/polling-proposal/${toSlug(poll.voteId)}`}>
                  <SubHeading>{poll.title}</SubHeading>
                </ExtendedLink>
                <Body
                  dangerouslySetInnerHTML={{
                    __html: poll.summary
                  }}
                />
                <Timer
                  endTimestamp={poll.endTime}
                  winningProposal={poll.winningProposal}
                  small
                  mb="-6"
                />
                <div>
                  {poll.active ? (
                    <Fragment>
                      <ExtendedLink
                        to={`/polling-proposal/${toSlug(poll.voteId)}`}
                      >
                        <StyledButton>Vote on Proposal</StyledButton>
                      </ExtendedLink>
                    </Fragment>
                  ) : (
                    <Fragment>
                      <ExtendedLink
                        to={`/polling-proposal/${toSlug(poll.voteId)}`}
                      >
                        <StyledButton variant="secondary">
                          See Details
                        </StyledButton>
                      </ExtendedLink>
                    </Fragment>
                  )}
                </div>
              </ProposalDetails>
            </Card.Element>
          </StyledCard>
        ))}
      </RiseUp>
    </Fragment>
  );
};

const reduxProps = (
  { proposals, accounts, hat, approvals, polls },
  { signaling }
) => {
  return {
    hat,
    approvals,
    proposals: proposals.filter(p => !!p.govVote === !!signaling),
    canVote: activeCanVote({ accounts }),
    fetching: accounts.fetching,
    votingFor: getActiveVotingFor({ accounts }),
    polls
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(PollingList);
