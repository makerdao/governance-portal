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
  // If we're running a testchain, we want the kovan topics, and we'll overwrite the addresses later
  if (network === 'ganache') {
    return fetchNetwork(staging, 'kovan');
  }
  if (process.env.REACT_APP_GOV_BACKEND === 'mock') {
    return fetchMock(network);
  }

  if (process.env.REACT_APP_GOV_BACKEND === 'local') {
    return fetchNetwork(local, network);
  }

  if (process.env.REACT_APP_GOV_BACKEND === 'staging') {
    return fetchNetwork(staging, network);
  }

  return fetchNetwork(prod, network);
};

// Actions ------------------------------------------------

const formatStringToConstantCase = kebob => {
  return kebob
    .split('-')
    .join('_')
    .toUpperCase();
};

const updateSourceForTestnet = topics => {
  const contracts = window.maker.service('smartContract')._getAllContractInfo();

  topics.map(topic => {
    topic.proposals.map(proposal => {
      const formattedPropKey = formatStringToConstantCase(proposal.key);
      if (formattedPropKey in contracts)
        proposal.source = contracts[formattedPropKey][0].address;
    });
  });

  return topics;
};

function extractProposals(topics, network) {
  // if we're using a testnet, overwrite proposal source with provided ganache addresses.
  if (network === 'ganache') updateSourceForTestnet(topics);

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
