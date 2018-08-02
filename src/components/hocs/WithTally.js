import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import round from 'lodash.round';

import { div, mul } from '../../utils/misc';

// this thing takes a candidate and passes on its approvals and its percentage
// of approvals from proposals in our backend
const WithTally = ({
  children,
  approvalFetching,
  approvalObj,
  candidate,
  totalApprovals
}) => {
  const loadingPercentage = approvalFetching;
  const loadingApprovals = approvalFetching;
  let percentage = 0;
  let approvals = 0;
  candidate = candidate.toLowerCase();
  if (approvalObj[candidate] !== undefined) {
    approvals = approvalObj[candidate];
    percentage = round(div(mul(approvals, 100), totalApprovals), 2);
  }
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

const reduxProps = ({ approvals }) => ({
  approvalFetching: approvals.fetching,
  approvalObj: approvals.approvals,
  totalApprovals: approvals.total
});

export default connect(
  reduxProps,
  {}
)(WithTally);
