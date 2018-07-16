import React, { Fragment } from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import DotSpacer from "../components/DotSpacer";
import VoterStatus from "../components/VoterStatus";
import VoteMeta from "../components/VoteMeta";
import VoteTally from "../components/VoteTally";
import WithTally from "../components/hocs/WithTally";
import Button from "../components/Button";
import Card from "../components/Card";
import { toSlug } from "../utils/misc";
import { fonts } from "../theme";
import { modalOpen } from "../reducers/modal";

const Heading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.xlarge};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? "block" : "none")};
  }
`;

const SubHeading = styled.p`
  color: #1f2c3c;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? "block" : "none")};
  }
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
  justify-content: space-between;
`;

const StyledAnchor = styled.a`
  color: #3080ed;
  cursor: pointer;
  padding-bottom: 3px;
  margin-bottom: -3px;
  border-bottom: ${({ noBorder }) => (noBorder ? "" : "1px dashed #317fed")};
`;

const Banner = styled.div`
  height: 82px;
  background: #fdede8;
  border: 1px solid #f77249;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 31px 0px;
  text-align: left;
  padding: 16px 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const BannerHeader = styled.div`
  font-size: 20px;
  color: #1f2c3c;
  font-weight: bold;
`;

const BannerBody = styled.div`
  white-space: pre;
  font-size: 15px;
  color: #546978;
  display: flex;
`;

const BannerContent = styled.div`
  margin-right: 8px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;

const RootWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 26px;
  align-items: center;
`;

const WelcomeBanner = ({ modalOpen }) => {
  return (
    <Banner>
      <BannerHeader>Welcome to the governance voting dashboard </BannerHeader>
      <BannerBody>
        <BannerContent>
          Before you can get started voting you will need to set up a secure
          voting contract
        </BannerContent>
        <StyledAnchor onClick={() => modalOpen("PROXY_SETUP")}>
          Set up secure voting contract
        </StyledAnchor>
      </BannerBody>
    </Banner>
  );
};

const Timeline = ({ modalOpen, isVotingSetup, data }) => (
  <Fragment>
    {isVotingSetup ? <VoterStatus /> : <WelcomeBanner modalOpen={modalOpen} />}
    <StyledCard>
      <RootWrapper>
        <div>
          <Heading>Current Root Proposal</Heading>
          <div style={{ display: "flex" }}>
            <StyledAnchor noBorder>See all system parameters</StyledAnchor>
            <DotSpacer />
            <StyledAnchor noBorder>What is the Root Proposal?</StyledAnchor>
          </div>
        </div>
        <Button>Vote for this Proposal</Button>
      </RootWrapper>
    </StyledCard>
    {data.map(topic => (
      <StyledCard key={topic.topic}>
        <Card.Top
          active={topic.active}
          topicTitle={topic.topic}
          collapsable={true}
          startCollapsed={false}
        />
        {topic.proposals.map(proposal => (
          <Card.Element key={proposal.title} height={163}>
            <ProposalDetails>
              <Link to={`/${toSlug(topic.topic)}/${toSlug(proposal.title)}`}>
                <SubHeading>{proposal.title}</SubHeading>
              </Link>
              <Body>{proposal.proposal_blurb}</Body>
              <VoteMeta {...proposal} />
            </ProposalDetails>
            <div>
              <WithTally candidate={proposal.source}>
                {({
                  loadingApprovals,
                  loadingPercentage,
                  approvals,
                  percentage
                }) => (
                  <VoteTally
                    loadingPercentage={loadingPercentage}
                    loadingApprovals={loadingApprovals}
                    approvals={approvals}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button
                onClick={() =>
                  modalOpen("VOTE", {
                    proposal: {
                      address: proposal.source,
                      title: proposal.title
                    }
                  })
                }
              >
                Vote for this Proposal
              </Button>
            </div>
          </Card.Element>
        ))}
      </StyledCard>
    ))}
  </Fragment>
);

const reduxProps = ({ topics }) => ({
  data: topics,
  isVotingSetup: true
});

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
