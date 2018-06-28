import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors, fonts, shadows, transitions, responsive } from "../styles";

const StyledCard = styled.div`
  transition: ${transitions.base};
  position: relative;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "none")};
  border: none;
  border-style: none;
  border-radius: 4px;
  display: block;
  color: rgb(${colors.black});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  box-shadow: ${shadows.soft};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  flex-direction: column;
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
`;

const CardTop = styled.div`
  transition: ${transitions.base};
  position: relative;
  padding: 23px 24px;
  width: 100%;
  max-width: ${({ maxWidth }) => (maxWidth ? `${maxWidth}px` : "none")};
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  border-style: none;
  border: none;
  color: rgb(${colors.dark});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
`;

const CardElement = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
  transition: ${transitions.base};
  position: relative;
  width: 100%;
  min-height: ${({ minHeight }) => (minHeight ? `${minHeight}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  border-top: solid 2px #eaeaea;
  color: rgb(${colors.dark});
  background-color: ${({ background }) => `rgb(${colors[background]})`};
  font-size: ${fonts.size.medium};
  font-weight: ${fonts.weight.normal};
  margin: 0 auto;
  text-align: left;
  overflow: hidden;
  @media screen and (${responsive.sm.max}) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

const Card = ({ background, children, ...props }) => (
  <StyledCard background={background} {...props}>
    {children}
  </StyledCard>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.string,
  minHeight: PropTypes.number
};

Card.defaultProps = {
  background: "white",
  minHeight: null
};

export default Card;
export { CardTop, CardElement };
