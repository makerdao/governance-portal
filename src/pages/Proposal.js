import React from "react";
import { connect } from "react-redux";
import find from "ramda/src/find";
import styled from "styled-components";

import { toSlug } from "../utils/misc";
import BaseLayout from "../layouts/base";
import VoteMeta from "../components/VoteMeta";
import VoteTally from "../components/VoteTally";
import Card from "../components/Card";
import NotFound from "./NotFound";
import { colors } from "../styles";

const WhiteBackground = styled.div`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: 34px;
  height: 311px;
  background-color: rgb(${colors.white});
  border-bottom: 2px solid #eaeaea;
  text-align: left;
`;

const StyledTop = styled.div`
  padding: 54px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1140px;
  margin: auto;
`;

const StyledTitle = styled.p`
  font-size: 28px;
  color: #1f2c3c;
  line-height: 33px;
  font-weight: 500;
`;

const StyledBody = styled.p`
  line-height: 30px;
  font-size: 17px;
  color: #546978;
  height: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 10px;
`;

const StyledVoteMeta = styled(VoteMeta)`
  margin-top: 10px;
`;

const StyledCenter = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 720px;
`;

const ConentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const RightPanels = styled.div`
  display: flex;
  flex-direction: column;
  width: 340px;
`;

const DescriptionCard = styled(Card)`
  max-width: 750px;
`;

const DetailsCard = styled(Card)`
  margin-bottom: 29px;
  height: 204px;
  padding: 14px 20px;
`;

const SupporterCard = styled(Card)`
  padding: 14px 20px;
  height: 334px;
  overflow-y: scroll;
`;

const Percentage = styled.p`
  color: #546978;
  line-height: 26px;
  font-size: 14px;
  &::after {
    content: "%";
  }
`;

const Address = styled.a`
  color: #2f80ed;
  line-height: 26px;
  font-size: 14px;
  max-width: 238px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Supporter = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardTitle = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #272727;
  line-height: 28px;
  margin-bottom: 6px;
`;

const Proposal = ({ match, data, voteState }) => {
  const { topicSlug, proposalSlug } = match.params;
  const topic = find(({ topic }) => toSlug(topic) === topicSlug, data);
  if (topic === undefined) return <NotFound />;
  const proposal = find(
    ({ title }) => toSlug(title) === proposalSlug,
    topic.proposals
  );
  if (proposal === undefined) return <NotFound />;
  const supporters = voteState[proposal.source] || null;
  console.log(supporters, voteState, proposal.source);
  return (
    <BaseLayout>
      <WhiteBackground>
        <StyledTop>
          <StyledCenter>
            <StyledTitle>{proposal.title}</StyledTitle>
            <StyledBody>{proposal.blurb}</StyledBody>
            <StyledVoteMeta
              verified={proposal.verified}
              submitter={proposal.submitted_by.name}
              submitterLink={proposal.submitted_by.link}
              creationDate={proposal.created}
            />
          </StyledCenter>
          <VoteTally wideButton withStatusBar />
        </StyledTop>
      </WhiteBackground>
      <ConentWrapper>
        <DescriptionCard>
          <div>left main</div>
        </DescriptionCard>
        <RightPanels>
          <DetailsCard>
            <CardTitle>Details</CardTitle>
            <div>right 1</div>
          </DetailsCard>
          <SupporterCard>
            <CardTitle>Top Supporters</CardTitle>
            <div>
              {supporters
                ? supporters.map(supporter => (
                    <Supporter key={supporter.address}>
                      <Percentage>{supporter.percent}</Percentage>
                      <Address
                        target="_blank"
                        href={`https://etherscan.io/address/${
                          supporter.address
                        }`}
                      >
                        {supporter.address}
                      </Address>
                    </Supporter>
                  ))
                : null}
            </div>
          </SupporterCard>
        </RightPanels>
      </ConentWrapper>
    </BaseLayout>
  );
};

const reduxProps = ({ mock, voteTally }) => ({
  data: mock,
  voteState: voteTally.tally
});

export default connect(
  reduxProps,
  {}
)(Proposal);
