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
  background-color: ${({ color }) => `rgb(${colors[color]})`};
  color: ${({ theme }) => theme.generic.white};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fonts.size.large};
  font-weight: ${fonts.weight.semibold};
  padding: 0 15px;
  height: 40px;
  width: ${({ wide, slim }) => (wide ? '320px' : slim ? '166px' : '240px')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:disabled {
    opacity: 0.6;
  }
  @media (hover: hover) {
    &:hover {
      box-shadow: ${({ disabled }) =>
        disabled ? '' : 'rgba(5, 45, 73, 0.1) 0px 0.25rem 0.75rem'};
      background-color: ${({ disabled, hoverColor, color }) =>
        !disabled
          ? hoverColor
            ? `rgb(${colors[hoverColor]})`
            : `rgb(${colors[color]})`
          : `rgb(${colors[color]})`};
    }
  }
  &:active {
    background-color: ${({ disabled, activeColor, color }) =>
      !disabled
        ? activeColor
          ? `rgb(${colors[activeColor]})`
          : `rgb(${colors[color]})`
        : `rgb(${colors[color]})`};
    color: rgba(${colors.whiteTransparent});
  }
`;

// TODO add icon option
const Button = ({
  children,
  loading,
  color,
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
    wide={wide}
    {...props}
  >
    {loading ? <Loader size={20} color="white" background={color} /> : children}
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
  hoverColor: 'darkGrey',
  activeColor: 'green',
  disabled: false,
  wide: false,
  slim: false
};

export default Button;
