import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, transitions } from "../theme";

const ProgressBar = styled.div`
  height: 8px;
  transition: ${transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background: #ededed;
  margin-bottom: 15px;
  margin-top: -15px;
`;

const Progress = styled.div`
  width: ${({ percentage }) => `${percentage}%`};
  background-color: rgb(${colors.green});
  height: 100%;
  transition: ${transitions.long};
`;

// #EDEDED
//  background-color: ${({ color }) => `rgb(${colors[color]})`};
//  width: ${({ wide }) => (wide ? "320px" : "240px")};

const StatusBar = ({ color, percentage, ...props }) => (
  <ProgressBar {...props}>
    <Progress percentage={percentage} color={color} {...props} />
  </ProgressBar>
);

StatusBar.propTypes = {
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string
};

StatusBar.defaultProps = {
  percentage: 0,
  color: "green"
};

export default StatusBar;
