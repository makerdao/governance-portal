import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { fonts, colors } from '../theme';

const load = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const expand = keyframes`
0% {
  transform: scale(1);
}
25% {
  transform: scale(2);
}
`;

const StyledLoader = styled.div`
  position: relative;
  font-size: ${fonts.size.tiny};
  margin: 0 auto;
  margin-top: ${({ mt }) => (mt ? `${mt}px` : '')};
  margin-right:${({ mr }) => (mr ? `${mr}px` : '')};
  margin-bottom: ${({ mb }) => (mb ? `${mb}px` : '')};
  text-indent: -9999em;
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  border-radius: 50%;
  background ${({ color }) => `rgb(${colors[color]})`};
  background: ${({ background, color }) =>
    `linear-gradient(to right, rgb(${colors[color]}) 10%, rgba(${
      colors[background]
    }, 0) 42%)`};
  animation: ${load} 1s infinite linear;
  transform: translateZ(0);
  &:before {
    width: 50%;
    height: 50%;
    background ${({ color }) => `rgb(${colors[color]})`};
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: '';
  }
  &:after {
    background: ${({ background }) => `rgb(${colors[background]})`};
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: '';
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const LoaderLineWrapper = styled.div``;

const Line = styled.div`
  animation: ${expand} 1s ease-in-out infinite;
  border-radius: 10px;
  display: inline-block;
  transform-origin: center center;
  margin: 0 3px;
  width: 2px;
  height: ${({ size }) => `${size}px`};
  &:nth-child(1) {
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
  &:nth-child(2) {
    animation-delay: 180ms;
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
  &:nth-child(3) {
    animation-delay: 360ms;
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
  &:nth-child(4) {
    animation-delay: 540ms;
    background: ${({ color }) => `rgb(${colors[color]})`};
  }
`;

const Loader = ({ size, color, background, alt, ...props }) => {
  if (alt)
    return (
      <LoaderLineWrapper {...props}>
        <Line color={color} size={size} />
        <Line color={color} size={size} />
        <Line color={color} size={size} />
        <Line color={color} size={size} />
      </LoaderLineWrapper>
    );
  else
    return (
      <StyledLoader
        size={size}
        color={color}
        background={background}
        {...props}
      />
    );
};

Loader.propTypes = {
  size: PropTypes.number,
  alt: PropTypes.bool,
  color: PropTypes.string,
  background: PropTypes.string
};

Loader.defaultProps = {
  size: 20,
  alt: false,
  color: 'dark',
  background: 'white'
};

export default Loader;
