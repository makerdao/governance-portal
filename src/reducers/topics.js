/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import find from 'ramda/src/find';
import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { initApprovalsFetch } from './approvals';
import mocked from '../_mock/topics';
import { getEtchedSlates } from '../chain/read';
import { eq, div, mul } from '../utils/misc';

const mockedBackend = mocked;

// Constants ----------------------------------------------

const TOPICS_SUCCESS = 'topics/TOPICS_SUCCESS';

// Selectors ----------------------------------------------

export function getProposal(state, proposalAddress) {
  for (let topic of state.topics) {
    const proposal = find(
      ({ source }) => eq(source, proposalAddress),
      topic.proposals
    );
    if (proposal !== undefined) return proposal;
  }
  return null;
}

export function getTopic(state, topicId) {
  for (let topic of state.topics) {
    if (topic.id === topicId) return topic;
  }
  return null;
}

export function getWinningProp(state, topicId) {
  const proposals = getTopic(state, topicId).proposals;
  // all child proposals of a topic must have the snapshot for this to work
  const hasEndSnapshot = proposals =>
    proposals.every(
      proposal =>
        proposal.end_approvals !== undefined &&
        proposal.end_percentage !== undefined
    );
  if (hasEndSnapshot(proposals)) {
    return proposals.sort((a, b) => a.end_approvals - b.end_approvals)[0];
  } else {
    // the end block hasn't been spashotted, so we look at fetched approvals
    const approvalObj = state.approvals.approvals;
    let mostApprovals = 0;
    let winner = null;
    for (let proposal of proposals) {
      let src = proposal.source.toLowerCase();
      if (approvalObj[src] !== undefined) {
        if (mostApprovals < approvalObj[src]) {
          winner = proposal;
          mostApprovals = approvalObj[src];
        }
      }
    }
    if (winner === null) return winner;
    const approvals = approvalObj[winner.source.toLowerCase()];
    const percentage =
      approvals > 0
        ? round(div(mul(approvals, 100), state.approvals.total), 2)
        : 0;
    return { ...winner, end_approvals: approvals, end_percentage: percentage };
  }
}

// Actions ------------------------------------------------

const fetchTopics = async network => {
  const backend = process.env.GOV_BACKEND || 'prod';

  if (backend == 'mock') {
    return mockedBackend[network];
  }

  if (backend == 'local') {
    return mockedBackend[network];
  }

  if (backend == 'prod') {
    return mockedBackend[network];
  }
};

export const topicsInit = network => async dispatch => {
  if (network === 'ganache') {
    // look up all slates
    const slates = await getEtchedSlates();
    const topics = [
      {
        topic: 'Test topic',
        proposals: slates.map(source => ({
          title: 'Test proposal',
          source
        }))
      }
    ];
    dispatch({ type: TOPICS_SUCCESS, payload: topics });
  } else {
    dispatch({ type: TOPICS_SUCCESS, payload: await fetchTopics(network) });
  }
  dispatch(initApprovalsFetch());
};

// Reducer ------------------------------------------------

const topics = createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => payload || []
});

export default topics;
