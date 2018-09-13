/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import find from 'ramda/src/find';
import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { initApprovalsFetch } from './approvals';
import { getEtchedSlates } from '../chain/read';
import { eq, div, mul, promiseRetry } from '../utils/misc';

// Constants ----------------------------------------------

const TOPICS_REQUEST = 'topics/TOPICS_REQUEST';
const TOPICS_SUCCESS = 'topics/TOPICS_SUCCESS';
const TOPICS_FAILURE = 'topics/TOPICS_FAILURE';

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

// Backend ------------------------------------------------

const local = 'http://127.0.0.1:3000';
const prod = 'https://content.makerfoundation.com';

const path = 'content/governance-dashboard';

// util

const check = async res => {
  if (!res.ok) {
    throw new Error(
      `unable to fetch topics: ${res.status} - ${await res.text()}`
    );
  }
};

// backends

const fetchMock = async network => {
  const mocked = await import('../_mock/topics');
  return mocked.default[network];
};

const fetchLocal = async network => {
  const res = await fetch(`${local}/${path}?network=${network}`);
  await check(res);
  return await res.json();
};

const fetchProd = async network => {
  const res = await fetch(`${prod}/${path}?network=${network}`);
  await check(res);
  return await res.json();
};

// dispatch

const fetchTopics = async network => {
  if (process.env.REACT_APP_GOV_BACKEND === 'mock') {
    return await fetchMock(network);
  }

  if (process.env.REACT_APP_GOV_BACKEND === 'local') {
    return await fetchLocal(network);
  }

  return await fetchProd(network);
};

// Actions ------------------------------------------------

const formatTopic = network => topic => {
  return {
    ...topic,
    proposals: topic.proposals.map(({ source, ...otherProps }) => ({
      ...otherProps,
      source: source.startsWith('{') ? JSON.parse(source)[network] : source
    }))
  };
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
    dispatch({
      type: TOPICS_SUCCESS,
      payload: topics.map(formatTopic(network))
    });
  } else {
    dispatch({ type: TOPICS_REQUEST, payload: {} });
    try {
      const topics = await promiseRetry({
        fn: fetchTopics,
        args: [network],
        times: 4,
        delay: 1
      });

      dispatch({
        type: TOPICS_SUCCESS,
        payload: topics.map(formatTopic(network))
      });
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
