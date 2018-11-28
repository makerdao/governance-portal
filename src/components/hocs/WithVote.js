import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'ramda/src/find';

import { toSlug, eq } from '../../utils/misc';

// this thing takes a proposal address and returns its name if it's one of our proposals
const WithVote = ({ children, proposalAddress, proposals, hat }) => {
  const proposal = find(({ source }) => eq(source, proposalAddress), proposals);
  if (proposal !== undefined)
    return children({
      proposalTitle: proposal.title,
      noVote: false,
      proposalSlug: `${toSlug(proposal.title)}`
    });
  if (eq(proposalAddress, hat.address))
    return children({
      proposalTitle: 'hat',
      noVote: false,
      proposalSlug: ``
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

const reduxProps = ({ proposals, hat }) => ({
  proposals,
  hat
});

export default connect(
  reduxProps,
  {}
)(WithVote);
