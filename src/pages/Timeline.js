import React, { Fragment } from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

import VoterStatus from '../components/VoterStatus';
import Button from '../components/Button';
import Card from '../components/Card';
import { toSlug, eq, formatDate, formatRound } from '../utils/misc';
import theme, { fonts } from '../theme';
import { modalOpen } from '../reducers/modal';
import { activeCanVote, getActiveVotingFor } from '../reducers/accounts';
import Vote from '../components/modals/Vote';
import TillHat from '../components/TillHatMeta';
import ExtendedLink from '../components/Onboarding/shared/ExtendedLink';
import { Banner, BannerBody, BannerContent } from '../components/Banner';

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

const DEV_USE_MIGRATION_BANNER = false;
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
              We've made a critical update to the Maker Voting Contract. If
              you've participated in any votes, please visit{' '}
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

const Timeline = ({
  modalOpen,
  proposals,
  canVote,
  fetching,
  votingFor,
  signaling,
  hat,
  approvals
}) => {
  const hatProposal = proposals.find(({ source }) => eq(source, hat.address));
  const otherProposals = proposals.filter(
    ({ source }) => !eq(source, hat.address)
  );
  otherProposals.sort((a, b) => b.end_timestamp - a.end_timestamp);

  const MCD_SOURCE = '0xF44113760c4f70aFeEb412C63bC713B13E6e202E';

  return (
    <Fragment>
      {DEV_USE_MIGRATION_BANNER ? <MigrationNotificationBanner /> : null}
      <VoterStatus signaling={signaling} legacy={true} />
      <RiseUp key={otherProposals.toString()}>
        {signaling || !hatProposal ? null : (
          <StyledCard>
            <Card.Element height={proposalWrapperHeight}>
              <ProposalDetails>
                <div style={{ display: 'flex' }}>
                  <ExtendedLink
                    to={`/executive-proposal/${toSlug(hatProposal.title)}`}
                  >
                    <SubHeading>{hatProposal.title}</SubHeading>
                  </ExtendedLink>
                  <Tag ml="16" green>
                    GOVERNING PROPOSAL
                  </Tag>
                </div>
                <Body
                  dangerouslySetInnerHTML={{
                    __html: hatProposal.proposal_blurb
                  }}
                />
                <ExtendedLink
                  to={`/executive-proposal/${toSlug(hatProposal.title)}`}
                >
                  Read more...
                </ExtendedLink>
                <div>
                  {!!hatProposal.end_approvals ? (
                    <Tag>{`Executed on ${formatDate(
                      hatProposal.end_timestamp
                    )} with ${formatRound(
                      hatProposal.end_approvals
                    )} MKR`}</Tag>
                  ) : (
                    <div>
                      <Tag>
                        {hatProposal.source === MCD_SOURCE
                          ? 'Available for execution on November 18th at 16:00 UTC'
                          : 'Available for execution'}
                      </Tag>
                    </div>
                  )}
                </div>
              </ProposalDetails>
              <div>
                <Button
                  disabled={!canVote}
                  loading={fetching}
                  onClick={() =>
                    modalOpen(Vote, {
                      proposal: {
                        address: hat.address,
                        title: hatProposal.title
                      }
                    })
                  }
                >
                  {votingFor.includes(hat.address.toLowerCase())
                    ? 'Withdraw vote'
                    : 'Vote for no change'}
                </Button>
                <br />
                <TillHat candidate={hatProposal.source} />
              </div>
            </Card.Element>
          </StyledCard>
        )}
        {otherProposals.map(proposal => (
          <StyledCard key={proposal.key}>
            <Card.Element key={proposal.title} height={proposalWrapperHeight}>
              <ProposalDetails>
                <ExtendedLink
                  to={`/executive-proposal/${toSlug(proposal.title)}`}
                >
                  <SubHeading>{proposal.title}</SubHeading>
                </ExtendedLink>
                <Body
                  dangerouslySetInnerHTML={{
                    __html: proposal.proposal_blurb
                  }}
                />
                <ExtendedLink
                  to={`/executive-proposal/${toSlug(proposal.title)}`}
                >
                  Read more...
                </ExtendedLink>
                {!!proposal.end_approvals ? (
                  <div>
                    <Tag>{`Executed on ${formatDate(
                      proposal.end_timestamp
                    )} with ${formatRound(proposal.end_approvals)} MKR`}</Tag>
                  </div>
                ) : hat.approvals < approvals.approvals[proposal.source] ? (
                  <div>
                    <Tag>
                      {proposal.source === MCD_SOURCE
                        ? 'Available for execution on November 18th at 16:00 UTC'
                        : 'Available for execution'}
                    </Tag>
                  </div>
                ) : null}
              </ProposalDetails>
              <div>
                <Fragment>
                  <Button
                    disabled={
                      !canVote || (!proposal.active && proposal.govVote)
                    }
                    loading={fetching}
                    onClick={() =>
                      modalOpen(Vote, {
                        proposal: {
                          address: proposal.source,
                          title: proposal.title
                        }
                      })
                    }
                  >
                    {votingFor.includes(proposal.source.toLowerCase())
                      ? 'Withdraw vote'
                      : 'Vote for this Proposal'}
                  </Button>
                  <br />
                  <TillHat candidate={proposal.source} />
                </Fragment>
              </div>
            </Card.Element>
          </StyledCard>
        ))}
      </RiseUp>
    </Fragment>
  );
};

const reduxProps = (
  { proposals, accounts, hat, approvals, topics },
  { signaling }
) => {
  return {
    hat,
    approvals,
    proposals: proposals.filter(p => !!p.govVote === !!signaling),
    canVote: activeCanVote({ accounts }),
    fetching: accounts.fetching,
    votingFor: getActiveVotingFor({ accounts }),
    topics
  };
};

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
