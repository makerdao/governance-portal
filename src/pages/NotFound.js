import React from 'react';
import styled from 'styled-components';
import theme from '../theme.js';

//
const Background = styled.div`
  background-color: ${theme.text.darker_default};
  width: 100vw;
  height: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  margin-bottom: -50vw;
`;

const StyledTitle = styled.div`
  font-size: 45px;
  color: white;
  font-weight: 500;
`;

//color: #FFFFFF
const StyledBody = styled.div`
  font-size: 19.5px;
  color: white;
  letter-spacing: 0.3px;
`;

export const HomeButton = styled.a`
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
  <Background>
    <StyledTitle>Page Not Found</StyledTitle>
    <StyledBody>
      The page you're looking for is either missing or it doesn't exist. <br />{' '}
      Double-check that the web address is correct.{' '}
    </StyledBody>
    <HomeButton>Go to Homepage</HomeButton>
  </Background>
);

export default NotFound;
