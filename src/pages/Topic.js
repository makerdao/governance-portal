import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import find from "ramda/src/find";
import styled from "styled-components";
import { Link } from "react-router-dom";

import NotFound from "./NotFound";
import VoteMeta from "../components/VoteMeta";
import Card, { CardTop, CardElement } from "../components/Card";
import VoteTally from "../components/VoteTally";
import BaseLayout from "../layouts/base";
import { toSlug } from "../utils/misc";
import { colors, fonts } from "../styles";

const ProposalDetails = styled.div`
  max-width: 59%;
  flex-direction: column;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const StyledTop = styled.div`
  height: 311px;
  background-color: rgb(${colors.white});
  border-bottom: 2px solid #eaeaea;
  text-align: left;
  padding: 54px 0px;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1140px;
  margin: auto;
`;

const StyledTitle = styled.p`
  font-size: 28px;
  color: #1f2c3c;
  line-height: 46px;
`;

const StyledBody = styled.p`
  line-height: 30px;
  font-size: 17px;
  color: #546978;
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledVoteMeta = styled(VoteMeta)`
  margin-top: 10px;
`;

const WhiteBackground = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 34px;
`;

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

const Body = styled.p`
  font-size: 16px;
  line-height: 26px;
  color: #546978;
  height: 52px;
  overflow: hidden;
`;

// TODO Styled body & body are confusingly similar

const Topic = ({ match, topics }) => {
  // fetching
  const topicSlug = match.params.topicSlug;
  const topic = find(({ topic }) => toSlug(topic) === topicSlug, topics);
  if (topic === undefined) return <NotFound />;
  const { topic: topicTitle, active, proposals } = topic;
  console.log(proposals);
  return (
    <BaseLayout>
      <WhiteBackground>
        <StyledTop>
          <StyledCenter>
            <StyledTitle>{topicTitle}</StyledTitle>
            <StyledBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              ultricies dignissim libero at ultrices. Duis iaculis, arcu quis
              rutrum vestibulum.
            </StyledBody>
            <StyledVoteMeta
              verified={true}
              submitter="Dai Foundation"
              submitterLink="https://makerdao.com"
              creationDate="12 Mar 2018"
            />
          </StyledCenter>
        </StyledTop>
      </WhiteBackground>

      <Card>
        <CardTop active={active} topic={topicTitle} />
        {proposals.map(proposal => (
          <CardElement key={proposal.title} height={163}>
            <ProposalDetails>
              <Link to={`/${toSlug(topicTitle)}/${toSlug(proposal.title)}`}>
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
      </Card>
    </BaseLayout>
  );
};

Topic.propTypes = {
  match: PropTypes.object.isRequired,
  topics: PropTypes.array.isRequired
};

Topic.defaultProps = {
  match: "",
  topics: []
};

const reduxProps = ({ mock }) => ({
  topics: mock
});

export default connect(
  reduxProps,
  {}
)(Topic);
