import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// this thing takes a candidate and passes on its approvals and its percentage of total approvals
// if we have that info in the redux store
const WithTally = ({
  children,
  voteTallyFetching,
  approvalFetching,
  approvalObj,
  candidate,
  voteTally
}) => {
  const loadingPercentage = voteTallyFetching;
  const loadingApprovals = approvalFetching;
  let percentage = 0;
  let approvals = 0;
  if (approvalObj[candidate] !== undefined) approvals = approvalObj[candidate];
  if (voteTally[candidate] === undefined)
    return children({
      loadingPercentage,
      loadingApprovals,
      percentage,
      approvals
    });
  let totalApprovals = 0;
  let candidateApprovals = 0;
  for (let [key, votes] of Object.entries(voteTally)) {
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
  candidate: ''
};

const reduxProps = ({ tally, approvals }) => ({
  voteTallyFetching: tally.fetching,
  voteTally: tally.tally,
  approvalFetching: approvals.fetching,
  approvalObj: approvals.approvals
});

export default connect(
  reduxProps,
  {}
)(WithTally);
