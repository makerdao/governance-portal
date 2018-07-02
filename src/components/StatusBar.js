import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, fonts, transitions } from "../styles";

const StyledBar = styled.div`
  height: 8px;
  transition: ${transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background: ${({ percentage }) =>
    `linear-gradient(to right, rgb(${colors.green}) ${percentage}%, rgb(${
      colors.green
    }) ${percentage}%, #EDEDED  ${percentage}%)`};
`;
// #EDEDED
//  background-color: ${({ color }) => `rgb(${colors[color]})`};
//  width: ${({ wide }) => (wide ? "320px" : "240px")};

const StatusBar = ({ color, percentage, ...props }) => (
  <StyledBar percentage={percentage} color={color} {...props} />
);

StatusBar.propTypes = {
  percentage: PropTypes.number,
  color: PropTypes.string
};

StatusBar.defaultProps = {
  percentage: 0,
  color: "green"
};

export default StatusBar;
