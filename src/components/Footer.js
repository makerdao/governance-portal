import React from "react";
import styled from "styled-components";

const FooterWrapper = styled.div`
  height: 194px;
  display: grid;
  grid-template-columns: 18% 18% 18% 18% 1fr;
  grid-gap: 10px;
  margin-top: 120px;
  margin-bottom: 50px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const FooterTitle = styled.div`
  font-size: 15px;
  letter-spacing: 0.4px;
  color: #000000;
  mix-blend-mode: normal;
  opacity: 0.7;
  margin-bottom: 10px;
  font-weight: bold;
`;

const FooterLink = styled.a`
  line-height: 34px;
  font-size: 15px;
  letter-spacing: 0.3px;
  color: #000000;
  mix-blend-mode: normal;
  opacity: 0.5;
`;

const Footer = () => (
  <FooterWrapper>
    <Column>
      <FooterTitle>Learn</FooterTitle>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
    </Column>
    <Column>
      <FooterTitle>Governance</FooterTitle>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
    </Column>
    <Column>
      <FooterTitle>Product</FooterTitle>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
    </Column>
    <Column>
      <FooterTitle>About</FooterTitle>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
    </Column>
    <Column>
      <FooterTitle>Learn</FooterTitle>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
      <FooterLink>Link</FooterLink>
    </Column>
  </FooterWrapper>
);

export default Footer;
