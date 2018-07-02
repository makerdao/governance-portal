import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import verified from "../assets/verified.svg";
// import { colors, fonts, transitions } from "../styles";

const VerifiedMark = styled.div`
  height: 20px;
  margin-top: -1px;
  margin-bottom: 1px;
  width: 26px;
  background-repeat: no-repeat;
  background-image: url(${verified});
`;

const Creation = styled.div`
  color: #30bd9f;
  &::before {
    color: #848484;
    content: "Created ";
  }
`;

const StyledAnchor = styled.a`
  color: #3080ed;
  cursor: pointer;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Verification = styled.div`
  &::after {
    content: "   •   ";
    white-space: pre;
    color: #c4c4c4;
  }
`;

const Submitter = styled.div`
  &::before {
    color: #848484;
    content: "Submitted by ";
  }
  &::after {
    content: "   •   ";
    white-space: pre;
    color: #c4c4c4;
  }
`;

const VoteMeta = ({
  verified,
  submitter,
  submitterLink,
  creationDate,
  ...props
}) => (
  <Footer {...props}>
    {verified ? (
      <Fragment>
        <VerifiedMark verified />
        <Verification>Verified Proposal</Verification>
      </Fragment>
    ) : null}
    <Submitter>
      <StyledAnchor href={submitterLink} target="_blank">
        {submitter}
      </StyledAnchor>
    </Submitter>
    <Creation>{creationDate}</Creation>
  </Footer>
);

VoteMeta.propTypes = {
  verified: PropTypes.bool,
  submitter: PropTypes.string,
  submitterLink: PropTypes.string,
  creationDate: PropTypes.string
};

VoteMeta.defaultProps = {
  verified: false,
  submitter: "",
  submitterLink: "",
  creationDate: ""
};

export default VoteMeta;
