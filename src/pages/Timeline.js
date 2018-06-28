import React from "react";
import styled from "styled-components";

import Button from "../components/Button";
import BaseLayout from "../layouts/base";
import Card, { CardTop, CardElement } from "../components/Card";
import { fonts } from "../styles";
import verified from "../assets/verified.svg";

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
  background-color: #d2f9f1;
  padding: 2px 15px;
  border-radius: 20px;
  color: #30bd9f;
`;

const Timeline = () => (
  <BaseLayout>
    <Card>
      <CardTop minHeight={48}>
        <Heading>Foundation Proposal</Heading>
        <TopicStatus>Topic active</TopicStatus>
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
        <Button>Vote this Proposal</Button>
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
        <Button>Vote this Proposal</Button>
      </CardElement>
    </Card>
  </BaseLayout>
);

export default Timeline;
