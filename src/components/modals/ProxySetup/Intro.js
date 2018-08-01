import React from 'react';

import {
  StyledTitle,
  StyledBlurb,
  Column,
  StyledAnchor,
  CircledNum,
  Section,
  GuideWrapper,
  Guide,
  GuideTitle,
  GuideInfo,
  IntroTxBox,
  Bold
} from '../shared/styles';
import round from 'lodash.round';
import Button from '../../Button';

const Intro = ({ nextStep, linkCost }) => (
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
    <IntroTxBox>
      <div>
        <p>Transactions required to set up</p> <p>Estimated transaction fees</p>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '8px'
        }}
      >
        <Bold>3</Bold>
        <Bold>${round(linkCost, 2)}</Bold>
      </div>
    </IntroTxBox>
    <StyledAnchor style={{ margin: '15px 0px' }} blue>
      Read more on our FAQ’s page
    </StyledAnchor>
    <Button slim onClick={nextStep}>
      Great get started
    </Button>
  </Column>
);

export default Intro;
