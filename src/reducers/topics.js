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

const TOPICS_REQUEST = 'topics/TOPICS_REQUEST';
const TOPICS_SUCCESS = 'topics/TOPICS_SUCCESS';
const TOPICS_FAILURE = 'topics/TOPICS_FAILURE';

const CMS_URL = 'https://content.makerfoundation.com';

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

export function getTopic(state, topicKey) {
  for (let topic of state.topics) {
    if (topic.key === topicKey) return topic;
  }
  return null;
}

export function getWinningProp(state, topicKey) {
  const proposals = getTopic(state, topicKey).proposals;
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
  const backend = process.env.REACT_APP_GOV_BACKEND || 'prod';
  const path = 'content/governance-dashboard';

  const check = async res => {
    if (!res.ok) {
      throw new Error(
        `unable to fetch topics: ${res.status} - ${await res.text()}`
      );
    }
  };

  if (backend == 'mock') {
    return mockedBackend[network];
  }

  if (backend == 'local') {
    const res = await fetch(`http://127.0.0.1:3000/${path}?network=${network}`);
    await check(res);
    return await res.json();
  }

  if (backend == 'prod') {
    const res = await fetch(`${CMS_URL}/${path}?network=${network}`);
    await check(res);
    return await res.json();
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
    dispatch({ type: TOPICS_REQUEST, payload: {} });
    try {
      const topics = await fetchTopics(network);
      dispatch({ type: TOPICS_SUCCESS, payload: topics });
    } catch (err) {
      dispatch({
        type: TOPICS_FAILURE,
        payload: {
          error: err
        }
      });
    }
  }
  dispatch(initApprovalsFetch());
};

// Reducer ------------------------------------------------

const topics = createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => payload || []
});

export default topics;
