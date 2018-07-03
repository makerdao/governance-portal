import PropTypes from "prop-types";
import { connect } from "react-redux";

const WithTally = ({ children, voteStateFetching, candidate, voteState }) => {
  const loadingPercentage = voteStateFetching;
  const loadingApprovals = false;
  let percentage = 0;
  let approvals = 0;
  if (voteState[candidate] === undefined)
    return children({
      loadingPercentage,
      loadingApprovals,
      percentage,
      approvals
    });
  let totalApprovals = 0;
  let candidateApprovals = 0;
  for (let [key, votes] of Object.entries(voteState)) {
    const approvals = votes.reduce((acc, curr) => acc + curr.deposits, 0);
    totalApprovals += approvals;
    if (key === candidate) candidateApprovals += approvals;
  }
  percentage = ((candidateApprovals * 100) / totalApprovals).toFixed(2);
  return children({
    loadingPercentage,
    loadingApprovals,
    percentage,
    approvals
  });
};

WithTally.propTypes = {
  children: PropTypes.func.isRequired,
  candidate: PropTypes.string
};

WithTally.defaultProps = {
  candidate: ""
};

const reduxProps = ({ voteTally }) => ({
  voteStateFetching: voteTally.fetching,
  voteState: voteTally.tally
});

export default connect(
  reduxProps,
  {}
)(WithTally);
