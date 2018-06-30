import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import Button from "../components/Button";
import BaseLayout from "../layouts/base";
import Card, { CardTop, CardElement } from "../components/Card";
import { fonts } from "../styles";
import verified from "../assets/verified.svg";
import { modalOpen } from "../reducers/modal";

const SubHeading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.large};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? "block" : "none")};
  }
`;

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

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  color: #546978;
`;

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Verification = styled.div`
  &::after {
    content: "   •   ";
    white-space: pre;
    color: #c4c4c4;
  }
`;

const Submitter = styled.div`
  &::before {
    color: #848484;
    content: "Submitted by ";
  }
  &::after {
    content: "   •   ";
    white-space: pre;
    color: #c4c4c4;
  }
`;

const Link = styled.a`
  color: #3080ed;
  cursor: pointer;
`;

const VerifiedMark = styled.div`
  height: ${({ verified }) => (verified ? "20px" : "0px")};
  margin-top: -1px;
  margin-bottom: 1px;
  width: ${({ verified }) => (verified ? "26px" : "0px")};
  background-repeat: no-repeat;
  background-image: url(${verified});
  visibility: ${({ verified }) => (verified ? "visible" : "hidden")};
`;

const Creation = styled.div`
  color: #30bd9f;
  &::before {
    color: #848484;
    content: "Created ";
  }
`;

const TopicStatus = styled.div`
  line-height: 24px;
  align-self: center;
  background-color: ${({ active }) => (active ? "#d2f9f1" : "#EAEFF7")};
  padding: 2px 15px;
  border-radius: 20px;
  color: ${({ active }) => (active ? "#30bd9f" : "#546978")};
  &::after {
    content: ${({ active }) => (active ? `"Topic active"` : `"Topic closed"`)};
  }
`;

const VoteTallyWrapper = styled.div``;

const VoteTally = styled.div`
  line-height: 20px;
  color: #212536;
  font-size: 18px;
  margin-top: -10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
`;

const VotePercent = styled.div`
  &::after {
    font-size: 16px;
    color: #848484;
    content: " VOTES";
  }
`;

const VoteAmount = styled.div`
  &::after {
    font-size: 16px;
    color: #848484;
    content: " MKR";
  }
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

const Timeline = ({ modalOpen }) => (
  <BaseLayout>
    <Banner>
      <BannerHeader> Welcome to the governance voting dashboard </BannerHeader>
      <BannerBody>
        Before you can get started voting you will need to set up a secure
        voting contract{"   "}
        <Link onClick={() => modalOpen("PROXY_SETUP")}>
          Set up secure voting contract
        </Link>
        <div style={{ color: "#c4c4c4" }}>{"   •   "}</div>
        <Link href="https://makerdao.com/" target="_blank">
          Read more
        </Link>
      </BannerBody>
    </Banner>
    <Card>
      <CardTop minHeight={48}>
        <Heading>Foundation Proposal</Heading>
        <TopicStatus active />
      </CardTop>
      <CardElement height={163}>
        <ProposalDetails>
          <SubHeading>
            Vote YES to the five core principals of the Maker Governance
            philosophy
          </SubHeading>
          <Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            ultricies dignissim libero at ultrices. Duis iaculis, arcu quis
            rutrum vestibulum.
          </Body>
          <Footer>
            <VerifiedMark verified />
            <Verification>Verified Proposal</Verification>
            <Submitter>
              <Link href="https://makerdao.com/" target="_blank">
                Dai Foundation
              </Link>
            </Submitter>
            <Creation>12 Mar 2018</Creation>
          </Footer>
        </ProposalDetails>
        <VoteTallyWrapper>
          <VoteTally>
            <VotePercent>31.68%</VotePercent>
            <VoteAmount>11.4k</VoteAmount>
          </VoteTally>
          <Button>Vote this Proposal</Button>
        </VoteTallyWrapper>
      </CardElement>
      <CardElement height={163}>
        <ProposalDetails>
          <SubHeading>
            Vote NO to the five core principals of the Maker Governance
            philosophy
          </SubHeading>
          <Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            ultricies dignissim libero at ultrices. Duis iaculis, arcu quis
            rutrum vestibulum.
          </Body>
          <Footer>
            <VerifiedMark verified />
            <Verification>Verified Proposal</Verification>
            <Submitter>
              <Link href="https://makerdao.com/" target="_blank">
                Dai Foundation
              </Link>
            </Submitter>
            <Creation>12 Mar 2018</Creation>
          </Footer>
        </ProposalDetails>
        <VoteTallyWrapper>
          <VoteTally>
            <VotePercent>22.6%</VotePercent>
            <VoteAmount>8.1k</VoteAmount>
          </VoteTally>
          <Button>Vote this Proposal</Button>
        </VoteTallyWrapper>
      </CardElement>
    </Card>
  </BaseLayout>
);

const reduxProps = ({}) => ({});

export default connect(
  reduxProps,
  { modalOpen }
)(Timeline);
