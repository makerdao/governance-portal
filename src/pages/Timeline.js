import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import VoteMeta from "../components/VoteMeta";
import VoteTally from "../components/VoteTally";
import BaseLayout from "../layouts/base";
import Card, { CardTop, CardElement } from "../components/Card";
import { toSlug } from "../utils/misc";
import { fonts } from "../styles";
import { modalOpen } from "../reducers/modal";

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
  border-bottom: 1px dashed #317fed;
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

const StyledCard = styled(Card)`
  margin-bottom: 30px;
`;

const Timeline = ({ modalOpen, data }) => (
  <BaseLayout>
    <Banner>
      <BannerHeader>Welcome to the governance voting dashboard </BannerHeader>
      <BannerBody>
        Before you can get started voting you will need to set up a secure
        voting contract{"   "}
        <StyledAnchor onClick={() => modalOpen("PROXY_SETUP")}>
          Set up secure voting contract
        </StyledAnchor>
      </BannerBody>
    </Banner>
    {data.map(topic => (
      <StyledCard key={topic.topic}>
        <CardTop active={topic.active} topic={topic.topic} />
        {topic.proposals.map(proposal => (
          <CardElement key={proposal.title} height={163}>
            <ProposalDetails>
              <Link to={`/${toSlug(topic.topic)}/${toSlug(proposal.title)}`}>
                <SubHeading>{proposal.title}</SubHeading>
              </Link>
              <Body>{proposal.blurb}</Body>
              <VoteMeta
                verified={proposal.verified}
                submitter={proposal.submitted_by.name}
                submitterLink={proposal.submitted_by.link}
                creationDate={proposal.created}
              />
            </ProposalDetails>
            <VoteTally />
          </CardElement>
        ))}
      </StyledCard>
    ))}
  </BaseLayout>
);

const reduxProps = ({ mock }) => ({
  data: mock
});

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
