import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toSlug } from '../../utils/misc';

// this thing takes a proposal address and returns its name if it's one of our proposals
const WithVote = ({
  children,
  proposalAddresses,
  proposals = [],
  signaling
}) => {
  const proposal = proposals
    .filter(({ govVote }) => govVote === !!signaling)
    .find(({ source }) => proposalAddresses.includes(source.toLowerCase()));
  if (proposal !== undefined)
    return children({
      proposalTitle: proposal.title,
      noVote: false,
      proposalSlug: `${toSlug(proposal.title)}`,
      topicKey: proposal.topicKey
    });
  return children({
    proposalTitle: '',
    noVote: true,
    proposalSlug: '----',
    topicKey: ''
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
