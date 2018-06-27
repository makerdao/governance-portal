import React from "react";
import styled from "styled-components";

import Button from "../components/Button";
import BaseLayout from "../layouts/base";
import Card from "../components/Card";
import { fonts, responsive, shadows } from "../styles";

const StyledCard = styled(Card)`
  background: transparent;
  display: block;
  border-top: ${({ noBorder }) => (noBorder ? `` : "solid 2px #eaeaea;")};
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "102px")};
  overflow: visible;
  width: 100%;
`;

const CardWrapper = styled.div`
  box-shadow: ${shadows.soft};
  border-radius: 4px;
  background-color: #fff;
`;

const CardContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-left: 28px;
  padding-right: 28px;
  width: 100%;
  @media screen and (${responsive.sm.max}) {
    align-items: flex-start;
    flex-direction: column;
    padding-bottom: 28px;
    padding-top: 28px;
  }
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

const Heading = styled.p`
  color: #1f2c3c;
  font-size: ${fonts.size.big};
  font-weight: ${fonts.weight.medium};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  flex: none;
  position: relative;
  @media screen and (max-width: 736px) {
    display: ${({ isAlwaysVisible }) => (isAlwaysVisible ? "block" : "none")};
  }
`;

const ProxyButton = styled(Button)`
  font-size: ${fonts.size.medium};
  height: 44px;
  padding: 0 15px 2px 15px;
  position: absolute;
  right: 29px;
  top: 29px;
`;

const Timeline = () => (
  <BaseLayout>
    <CardWrapper>
      <StyledCard minHeight={64} noBorder>
        <CardContainer>
          <Heading>ETH Debt Ceiling</Heading>
        </CardContainer>
      </StyledCard>
      <StyledCard minHeight={102}>
        <CardContainer>
          <SubHeading>Change Debt Ceiling to $100M</SubHeading>
          <ProxyButton left color="green">
            Vote this Proposal
          </ProxyButton>
        </CardContainer>
      </StyledCard>
      <StyledCard minHeight={102}>
        <CardContainer>
          <SubHeading>Change Debt Ceiling to $75M</SubHeading>
          <ProxyButton left color="green">
            Vote this Proposal
          </ProxyButton>
        </CardContainer>
      </StyledCard>
    </CardWrapper>
  </BaseLayout>
);

export default Timeline;
