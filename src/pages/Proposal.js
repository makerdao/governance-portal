import React, { Component } from "react";
import { connect } from "react-redux";
import find from "ramda/src/find";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import { toSlug } from "../utils/misc";
import { ethScanLink } from "../utils/ethereum";
import VoteMeta from "../components/VoteMeta";
import VoteTally from "../components/VoteTally";
import Button from "../components/Button";
import Card from "../components/Card";
import ResizeSpinLoader from "../components/ResizeSpinLoader";
import WithTally from "../components/hocs/WithTally";
import NotFound from "./NotFound";
import { colors } from "../theme";

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
  padding: 0px 25px 18px 25px;
  color: #546978;
  line-height: 30px;
`;

const DetailsCard = styled(Card)`
  margin-bottom: 29px;
  height: 204px;
  padding: 14px 20px;
`;

const SupporterCard = styled(Card)`
  padding: 14px 20px;
  height: 334px;
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

const SupporterWrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
`;

const NoSupporters = styled.p`
  text-align: center;
  color: gray;
  font-size: 20px;
  margin-top: 105px;
  font-style: oblique;
`;

const LoadingWrapper = styled.div`
  padding: 25px 0;
`;

class Proposal extends Component {
  state = {
    proposal: {},
    markdown: ""
  };

  componentDidMount() {
    const { topicSlug, proposalSlug } = this.props.match.params;
    const topic = find(
      ({ topic }) => toSlug(topic) === topicSlug,
      this.props.topics
    );
    if (topic === undefined) return; //not found
    const proposal = find(
      ({ title }) => toSlug(title) === proposalSlug,
      topic.proposals
    );
    if (proposal === undefined) return; //not found
    this.setState({ proposal });
    fetch(proposal.about)
      .then(response => response.text())
      .then(markdown => {
        this.setState({
          markdown
        });
      });
  }

  render() {
    const { proposal, markdown } = this.state;
    if (Object.keys(proposal).length === 0) return <NotFound />;
    const { voteState, voteStateFetching } = this.props;
    const supporters = voteState[proposal.source] || null;
    return (
      <React.Fragment>
        <WhiteBackground>
          <StyledTop>
            <StyledCenter>
              <StyledTitle>{proposal.title}</StyledTitle>
              <StyledBody>{proposal.proposal_blurb}</StyledBody>
              <StyledVoteMeta {...proposal} />
            </StyledCenter>
            <div>
              <WithTally candidate={proposal.source}>
                {({
                  loadingApprovals,
                  loadingPercentage,
                  approvals,
                  percentage
                }) => (
                  <VoteTally
                    statusBar
                    loadingPercentage={loadingPercentage}
                    loadingApprovals={loadingApprovals}
                    approvals={approvals}
                    percentage={percentage}
                  />
                )}
              </WithTally>
              <Button wide={true}>Vote for this Proposal</Button>
            </div>
          </StyledTop>
        </WhiteBackground>
        <ConentWrapper>
          <DescriptionCard>
            {markdown ? (
              <ReactMarkdown
                className="markdown"
                skipHtml={true}
                source={markdown}
              />
            ) : (
              <div />
            )}
          </DescriptionCard>
          <RightPanels>
            <DetailsCard>
              <CardTitle>Details</CardTitle>
              {/* <Supporter>
                <Percentage>Topic</Percentage>
                <Address>poasidjf aoisdjf </Address>
              </Supporter> */}
            </DetailsCard>
            <SupporterCard>
              <CardTitle>Top Supporters</CardTitle>
              <SupporterWrapper>
                {supporters ? (
                  supporters.map(supporter => (
                    <Supporter key={supporter.address}>
                      <Percentage>{supporter.percent}</Percentage>
                      <Address
                        target="_blank"
                        href={ethScanLink(supporter.address)}
                      >
                        {supporter.address}
                      </Address>
                    </Supporter>
                  ))
                ) : voteStateFetching ? (
                  <LoadingWrapper>
                    <ResizeSpinLoader size={12} color="#6D6D6D" />
                  </LoadingWrapper>
                ) : (
                  <NoSupporters>No supporters found</NoSupporters>
                )}
              </SupporterWrapper>
            </SupporterCard>
          </RightPanels>
        </ConentWrapper>
      </React.Fragment>
    );
  }
}

const reduxProps = ({ topics, tally }) => ({
  topics,
  voteStateFetching: tally.fetching,
  voteState: tally.tally
});

export default connect(
  reduxProps,
  {}
)(Proposal);
