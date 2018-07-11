import React from "react";

import {
  StyledContainer,
  StyledCenter,
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Column,
  StyledAnchor,
  CircledNum,
  Section,
  GuideWrapper,
  Guide,
  GuideTitle,
  GuideInfo,
  SetupLater,
  InfoBox,
  InfoBoxSection,
  InfoBoxHeading,
  InfoBoxContent,
  ProgressTabsWrapper,
  TabsTitle,
  TabsTitleWrapper,
  TxHash,
  Styledinput
} from "./style";
import Button from "../../Button";

const Intro = ({ modalClose, nextStep }) => (
  <Column center maxWidth={540}>
    <StyledTitle>Welcome to the secure voting setup</StyledTitle>
    <StyledBlurb>
      Setting up your secure voting contract will enable you to keep your MKR
      stored safely in a <StyledAnchor>cold wallet</StyledAnchor> but be able to
      vote with your MKR via a <StyledAnchor>hot wallet</StyledAnchor>. The
      steps are as follows:
    </StyledBlurb>
    <GuideWrapper>
      <Section>
        <CircledNum size={32}>1</CircledNum>
        <Guide>
          <GuideTitle>Link Wallets</GuideTitle>
          <GuideInfo>Link your cold and hot wallets</GuideInfo>
        </Guide>
      </Section>
      <Section>
        <CircledNum size={32}>2</CircledNum>
        <Guide>
          <GuideTitle>Lock MKR</GuideTitle>
          <GuideInfo>Lock MKR in your secure voting contract</GuideInfo>
        </Guide>
      </Section>
      <Section>
        <CircledNum size={32}>3</CircledNum>
        <Guide>
          <GuideTitle>Finish</GuideTitle>
          <GuideInfo>Confirmation of set up</GuideInfo>
        </Guide>
      </Section>
    </GuideWrapper>
    <StyledBlurb>
      Its extremely secure and set up takes 5 minutes.{" "}
      <StyledAnchor blue>FAQ’s for more</StyledAnchor>
    </StyledBlurb>
    <Button slim onClick={nextStep}>
      Great get started
    </Button>
    <SetupLater onClick={modalClose}>Set up later</SetupLater>
  </Column>
);

export default Intro;
