/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { initApprovalsFetch } from './approvals';
import { div, mul, promiseRetry } from '../utils/misc';

// Constants ----------------------------------------------

const PROPOSALS_REQUEST = 'proposals/REQUEST';
const PROPOSALS_SUCCESS = 'proposals/SUCCESS';
const PROPOSALS_FAILURE = 'proposals/FAILURE';

// Selectors ----------------------------------------------

export function getWinningProp(state, topicKey) {
  const proposals = state.proposals.filter(p => p.topicKey === topicKey);
  // all child proposals of a topic must have the snapshot for this to work
  const hasEndSnapshot = proposals =>
    proposals.every(proposal => proposal.end_approvals !== undefined);
  if (hasEndSnapshot(proposals)) {
    return proposals.sort(
      (a, b) => Number(b.end_approvals) - Number(a.end_approvals)
    )[0];
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
    return {
      ...winner,
      end_approvals: approvals,
      end_percentage: percentage
    };
  }
}

// Backend ------------------------------------------------

const local = 'http://127.0.0.1:3000';
const prod = 'https://content.makerfoundation.com';
const staging = 'https://elb.content.makerfoundation.com:444';

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

const fetchMock = async () => {
  const mocked = await import('../_mock/topics');
  return mocked.default;
};

const fetchNetwork = async (url, network) => {
  const res = await fetch(`${url}/${path}?network=${network}`);
  await check(res);
  return await res.json();
};

// dispatch

const fetchTopics = async network => {
  if (process.env.REACT_APP_GOV_BACKEND === 'mock' || network === 'ganache') {
    return await fetchMock(network);
  }

  if (process.env.REACT_APP_GOV_BACKEND === 'local') {
    return await fetchNetwork(local, network);
  }

  if (process.env.REACT_APP_GOV_BACKEND === 'staging') {
    return await fetchNetwork(staging, network);
  }

  return await fetchNetwork(prod, network);
};

// Actions ------------------------------------------------

function extractProposals(topics, network) {
  return topics.reduce((acc, topic) => {
    const proposals = topic.proposals.map(({ source, ...otherProps }) => ({
      ...otherProps,
      source: source.startsWith('{') ? JSON.parse(source)[network] : source,
      active: topic.active,
      govVote: topic.govVote,
      topicKey: topic.key
    }));
    return acc.concat(proposals);
  }, []);
}

export const proposalsInit = network => async dispatch => {
  dispatch({ type: PROPOSALS_REQUEST, payload: {} });
  try {
    const topics = await promiseRetry({
      fn: fetchTopics,
      args: [network],
      times: 4,
      delay: 1
    });

    dispatch({
      type: PROPOSALS_SUCCESS,
      payload: extractProposals(topics, network)
    });
  } catch (err) {
    dispatch({
      type: PROPOSALS_FAILURE,
      payload: {
        error: err
      }
    });
  }
  dispatch(initApprovalsFetch());
};

// Reducer ------------------------------------------------

export default createReducer([], {
  [PROPOSALS_SUCCESS]: (_, { payload }) => payload || []
});
