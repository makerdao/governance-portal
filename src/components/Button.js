import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, fonts, transitions } from "../styles";

const StyledButton = styled.button`
  transition: ${transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background-color: ${({ color }) => `rgb(${colors[color]})`};
  color: rgb(${colors.white});
  border-radius: 2px;
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.semibold};
  padding: 0 15px;
  height: 40px;
  width: 240px;
  cursor: ${({ disabled }) => (disabled ? "auto" : "pointer")};
  &:disabled {
    opacity: 0.6;
  }
  @media (hover: hover) {
    &:hover {
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

const Button = ({
  children,
  fetching,
  color,
  hoverColor,
  activeColor,
  disabled,
  ...props
}) => (
  <StyledButton
    color={color}
    hoverColor={hoverColor}
    activeColor={activeColor}
    disabled={disabled}
    {...props}
  >
    {fetching ? "fetching" : children}
  </StyledButton>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
  fetching: PropTypes.bool,
  color: PropTypes.string,
  hoverColor: PropTypes.string,
  activeColor: PropTypes.string,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  fetching: false,
  color: "green",
  hoverColor: "darkGrey",
  activeColor: "green",
  disabled: false
};

export default Button;
