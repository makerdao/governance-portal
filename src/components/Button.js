import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Loader from './Loader';
import { colors, fonts } from '../theme';

const StyledButton = styled.button`
  transition: ${({ theme }) => theme.transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background-color: ${({ theme, bgColor }) =>
    bgColor ? `rgb(${colors[bgColor]})` : theme.generic.white};
  color: ${({ color, textColor }) => textColor || `rgb(${colors[color]})`};
  border-radius: 4px;
  border: 2px solid
    ${({ color, borderColor }) => borderColor || `rgb(${colors[color]})`};
  font-size: ${({ theme }) => theme.fonts.size.large};
  font-weight: ${fonts.weight.semibold};
  padding: 0 15px;
  height: 40px;
  width: ${({ width, wide, slim }) =>
    width || (wide ? '320px' : slim ? '166px' : '240px')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:disabled {
    opacity: 0.6;
  }
  @media (hover: hover) {
    &:hover {
      color: ${({ hoverColor, hoverTextColor }) =>
        hoverTextColor || `rgb(${colors[hoverColor]})`};
      border-color: ${({ hoverColor, hoverBorderColor }) =>
        hoverBorderColor || `rgb(${colors[hoverColor]})`};
    }
  }
`;

// TODO add icon option
const Button = ({
  children,
  loading,
  color,
  textColor,
  hoverColor,
  activeColor,
  disabled,
  wide,
  ...props
}) => (
  <StyledButton
    color={color}
    hoverColor={hoverColor}
    activeColor={activeColor}
    disabled={disabled}
    textColor={textColor}
    wide={wide}
    {...props}
  >
    {loading ? (
      <Loader alt size={12} color="green" background={color} />
    ) : (
      children
    )}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool,
  slim: PropTypes.bool
};

Button.defaultProps = {
  loading: false,
  color: 'green',
  hoverColor: 'green',
  disabled: false,
  wide: false,
  slim: false
};

export default Button;
