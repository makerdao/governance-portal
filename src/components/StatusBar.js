import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { transitions } from "../theme";

const ProgressBar = styled.div`
  height: 8px;
  transition: ${transitions.button};
  position: relative;
  border: none;
  border-style: none;
  box-sizing: border-box;
  background: ${({ theme }) => theme.generic.default};
  margin-bottom: 15px;
  margin-top: -15px;
`;

const Progress = styled.div`
  width: ${({ percentage }) => `${percentage}%`};
  background-color: ${({ theme }) => theme.brand.default};
  height: 100%;
  transition: ${transitions.long};
`;

const StatusBar = ({ percentage, ...props }) => (
  <ProgressBar {...props}>
    <Progress percentage={percentage} {...props} />
  </ProgressBar>
);

StatusBar.propTypes = {
  percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

StatusBar.defaultProps = {
  percentage: 0
};

export default StatusBar;
