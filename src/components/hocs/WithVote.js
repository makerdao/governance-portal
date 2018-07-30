import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'ramda/src/find';

import { toSlug, eq } from '../../utils/misc';

// this thing takes a proposal address and returns its name if it's one of our topics
const WithVote = ({ children, proposalAddress, topics }) => {
  for (let topic of topics) {
    const proposal = find(
      ({ source }) => eq(source, proposalAddress),
      topic.proposals
    );
    if (proposal !== undefined)
      return children({
        proposalTitle: proposal.title,
        noVote: false,
        proposalSlug: `${toSlug(topic.topic)}/${toSlug(proposal.title)}`
      });
  }
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

const reduxProps = ({ topics }) => ({
  topics
});

export default connect(
  reduxProps,
  {}
)(WithVote);
