import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";

const StyledLayout = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  text-align: center;
  padding: 0 16px;
`;

const StyledContent = styled.div`
  width: 100%;
`;

const BaseLayout = ({ children }) => (
  <StyledLayout>
    <StyledContent>{children}</StyledContent>
  </StyledLayout>
);

BaseLayout.propTypes = {
  children: PropTypes.node.isRequired
};

const reduxProps = ({}) => ({});

export default connect(
  reduxProps,
  {}
)(BaseLayout);
