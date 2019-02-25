import React from 'react';
import { formatRound } from '../../../utils/misc';

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
  TooltipCard,
  Bold
} from '../shared/styles';
import Button from '../../Button';

const Intro = ({ nextStep, linkCost }) => (
  <Column center maxWidth={540}>
    <StyledTitle>Getting set up to vote</StyledTitle>
    <StyledBlurb>
      To vote you will need to set up a voting contract. This contract enables
      you to keep you MKR stored safely in a{' '}
      <TooltipCard
        link="https://makerdao.com/faq/"
        body="This is where you store your MKR. You will be able to send your tokens back to this account at any time."
        title="Cold Wallet"
      >
        cold wallet
      </TooltipCard>{' '}
      but be able to vote with your MKR via a{' '}
      <TooltipCard
        link="https://makerdao.com/faq/"
        body="This is the wallet you vote with. This account will never be able to withdraw your tokens to itself."
        title="Hot Wallet"
      >
        hot wallet
      </TooltipCard>
    </StyledBlurb>
    <GuideWrapper>
      <Section>
        <CircledNum size={32}>1</CircledNum>
        <Guide>
          <GuideTitle>Link Wallets</GuideTitle>
          <GuideInfo>
            Link your{' '}
            <TooltipCard
              link="https://makerdao.com/faq/"
              body="This is where you store your MKR. You will be able to send your tokens back to this account at any time."
              title="Cold Wallet"
            >
              cold
            </TooltipCard>{' '}
            and{' '}
            <TooltipCard
              link="https://makerdao.com/faq/"
              body="This the wallet you vote with. This account will never be able to withdraw your tokens to itself."
              title="Hot Wallet"
            >
              hot wallet
            </TooltipCard>{' '}
            to safely vote
          </GuideInfo>{' '}
        </Guide>
      </Section>
      <Section>
        <CircledNum size={32}>2</CircledNum>
        <Guide>
          <GuideTitle>Lock MKR</GuideTitle>
          <GuideInfo>
            <TooltipCard
              link="https://makerdao.com/faq/"
              body="Redeem your MKR tokens for voting rights."
              title="Locking MKR"
            >
              Lock MKR
            </TooltipCard>
          </GuideInfo>
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
        <Bold>4</Bold>
        <Bold>${formatRound(linkCost, 2)}</Bold>
      </div>
    </IntroTxBox>
    <StyledAnchor
      href="https://makerdao.com/faq"
      target="_blank"
      rel="noopener noreferrer"
      style={{ margin: '15px 0px' }}
      blue
    >
      Read more on our FAQ’s page
    </StyledAnchor>
    <Button onClick={nextStep}>Get started</Button>
  </Column>
);

export default Intro;
