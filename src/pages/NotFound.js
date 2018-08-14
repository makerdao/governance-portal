import React from 'react';
import styled from 'styled-components';
import theme from '../theme.js';
import { Link } from 'react-router-dom';

const Container = styled.div`
  text-align: center;
`;

const Background = styled.div`
  background-color: ${theme.text.darker_default};
  width: 100vw;
  height: 100vw;
  position: absolute;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: -50vw;
  overflow: auto;
  z-index: -2;
`;

const StyledTitle = styled.div`
  font-size: 45px;
  line-height: 45px;
  color: white;
  font-weight: 500;
  padding-top: 191px;
`;

const StyledBody = styled.div`
  font-size: 19.5px;
  line-height: 23px;
  color: white;
  letter-spacing: 0.3px;
  margin: 23px auto;
  width: 602px;
`;

export const HomeButton = styled(Link)`
  border-radius: 5px;
  color: ${theme.text.darker_default};
  background-color: white;
  width: 200px;
  height: 52px;
  line-height: 52px;
  letter-spacing: 0.2px;
  display: inline-block;
  font-weight: 500;
`;

const NotFound = () => (
  <Container>
    <Background />
    <StyledTitle>Page Not Found</StyledTitle>
    <StyledBody>
      The page you're looking for is either missing or it doesn't exist.
      Double-check that the web address is correct.
    </StyledBody>
    <HomeButton to="/">Go to Homepage</HomeButton>
  </Container>
);

export default NotFound;
