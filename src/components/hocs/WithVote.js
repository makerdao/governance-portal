import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import find from 'ramda/src/find';

import { toSlug } from '../../utils/misc';

// this thing takes a proposal address and returns its name if it's one of our topics
const WithTally = ({ children, proposalAddress, topics }) => {
  for (let topic of topics) {
    const proposal = find(
      ({ source }) => source.toLowerCase() === proposalAddress.toLowerCase(),
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

WithTally.propTypes = {
  children: PropTypes.func.isRequired,
  proposal: PropTypes.string
};

WithTally.defaultProps = {
  proposal: ''
};

const reduxProps = ({ topics }) => ({
  topics
});

export default connect(
  reduxProps,
  {}
)(WithTally);
