import styled, { keyframes } from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

const loading = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const ResizeSpin = styled.div`
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.25em;
  color: ${props => props.color};
  font-size: ${props => `${props.size}px`};
  height: 10em;
  margin: 55px auto;
  position: relative;
  text-indent: -99999em;
  transform: translateZ(0);
  width: 10em;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  &:before {
    animation: ${props => `${loading} ${props.duration}s infinite ease 1.5s`};
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    border-radius: 10.2em 0 0 10.2em;
    content: '';
    height: 10.2em;
    left: -0.1em;
    position: absolute;
    top: -0.1em;
    transform-origin: 5.2em 5.1em;
    width: 5.2em;
  }
  &:after {
    animation: ${props => `${loading} ${props.duration}s infinite ease`};
    background: transparent;
    border-radius: 50%;
    border-radius: 0 10.2em 10.2em 0;
    content: '';
    height: 10.2em;
    left: 5.1em;
    position: absolute;
    top: -0.1em;
    transform-origin: 0px 5.1em;
    width: 5.2em;
  }
`;

const ResizeSpinBacker = styled.div`
  border-radius: 50%;
  box-shadow: inset 0 0 0 0.25em;
  color: #e5e5e5;
  font-size: ${props => `${props.size}px`};
  height: 10em;
  margin: 55px auto;
  position: relative;
  text-indent: -99999em;
  transform: translateZ(0);
  width: 10em;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ResizeSpinLoader = props => (
  <div style={{ position: 'relative' }}>
    <ResizeSpinBacker {...props} />
    <ResizeSpin {...props} />
  </div>
);

ResizeSpinLoader.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  duration: PropTypes.number,
  size: PropTypes.number
};

ResizeSpinLoader.defaultProps = {
  background: '#fff',
  color: '#000',
  duration: 2,
  size: 11
};

export default ResizeSpinLoader;
