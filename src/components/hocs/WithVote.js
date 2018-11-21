import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'ramda/src/find';

import { toSlug, eq } from '../../utils/misc';

// this thing takes a proposal address and returns its name if it's one of our proposals
const WithVote = ({ children, proposalAddress, proposals }) => {
  const proposal = find(({ source }) => eq(source, proposalAddress), proposals);
  if (proposal !== undefined)
    return children({
      proposalTitle: proposal.title,
      noVote: false,
      proposalSlug: `${toSlug(proposal.title)}`
    });
  return children({
    proposalTitle: 'Not',
    noVote: true,
    proposalSlug: '----'
  });
};

WithVote.propTypes = {
  children: PropTypes.func.isRequired,
  proposal: PropTypes.string
};

WithVote.defaultProps = {
  proposal: ''
};

const reduxProps = ({ proposals }) => ({
  proposals
});

export default connect(
  reduxProps,
  {}
)(WithVote);
