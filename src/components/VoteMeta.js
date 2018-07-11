import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import verified from "../imgs/verified.svg";
import { formatDate } from "../utils/misc";

const VerifiedMark = styled.div`
  height: 20px;
  margin-top: 1px;
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

const VoteMeta = ({ verified, submitted_by, date, ...props }) => (
  <Footer {...props}>
    {verified ? (
      <Fragment>
        <VerifiedMark verified />
        <Verification>Verified Proposal</Verification>
      </Fragment>
    ) : null}
    <Submitter>
      <StyledAnchor href={submitted_by.link} target="_blank">
        {submitted_by.name}
      </StyledAnchor>
    </Submitter>
    <Creation>{formatDate(date)}</Creation>
  </Footer>
);

VoteMeta.propTypes = {
  verified: PropTypes.bool,
  submitted_by: PropTypes.object,
  date: PropTypes.string
};

VoteMeta.defaultProps = {
  verified: false,
  submitted_by: {
    name: "",
    link: ""
  },
  date: ""
};

export default VoteMeta;
