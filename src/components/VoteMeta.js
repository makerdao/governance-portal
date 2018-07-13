import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import verified from "../imgs/verified.svg";
import { formatDate } from "../utils/misc";

const VerifiedMark = styled.div`
  height: 20px;
  margin-top: 1px;
  width: 26px;
  background: url(${verified}) no-repeat;
`;

const Created = styled.div`
  color: ${({ theme }) => theme.text.green};
  &::before {
    color: ${({ theme }) => theme.text.dim_grey};
    content: "Created ";
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Verification = styled.div`
  &::after {
    content: "   •   ";
    white-space: pre;
    color: ${({ theme }) => theme.text.dark_default};
  }
`;

const Submitter = styled.div`
  &::before {
    color: ${({ theme }) => theme.text.dim_grey};
    content: "Submitted by ";
  }
  &::after {
    content: "   •   ";
    white-space: pre;
    color: ${({ theme }) => theme.text.dark_default};
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
      <a href={submitted_by.link} target="_blank">
        {submitted_by.name}
      </a>
    </Submitter>
    <Created>{formatDate(date)}</Created>
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
