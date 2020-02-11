/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import round from 'lodash.round';

import { createReducer } from '../utils/redux';
import { initApprovalsFetch } from './approvals';
import { formatHistoricalPolls } from './polling';
import { div, mul, promiseRetry, check } from '../utils/misc';

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
// const prod = 'https://content.makerfoundation.com';
// const staging = 'https://elb.content.makerfoundation.com:444';
const prod = 'https://cms-gov.makerfoundation.com';
const staging = 'https://elb.cms-gov.makerfoundation.com:444';

const path = 'content/governance-dashboard';

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
  if (process.env.REACT_APP_GOV_BACKEND === 'mock') {
    return fetchMock(network);
  }

  // If we're running a testchain, we want the kovan topics, and we'll overwrite the addresses later
  if (network === 'ganache') {
    return fetchNetwork(staging, 'kovan');
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

const updateSourceForTestnet = topics => {
  const contracts = window.maker.service('smartContract')._getAllContractInfo();

  for (const topic of topics) {
    for (const proposal of topic.proposals) {
      if (proposal.contract_name in contracts)
        proposal.source = contracts[proposal.contract_name][0].address;
    }
  }

  return topics;
};

async function extractProposalsAndGetSdkInfo(topics, network) {
  // if we're using a testnet, overwrite proposal source with provided ganache addresses.
  if (network === 'ganache') updateSourceForTestnet(topics);

  const proposals = topics.reduce((acc, topic) => {
    const proposals = topic.proposals.map(({ source, ...otherProps }) => ({
      ...otherProps,
      source: source.startsWith('{') ? JSON.parse(source)[network] : source,
      active: topic.active,
      govVote: topic.govVote,
      topicKey: topic.key,
      topicTitle: topic.topic
    }));
    return acc.concat(proposals);
  }, []);
  return Promise.all(
    proposals.map(async p => {
      if (p.active) {
        const [eta, executed] = await Promise.all([
          window.maker.service('spell').getEta(p.source),
          window.maker.service('spell').getDone(p.source)
        ]);
        p.eta = eta;
        p.executed = executed;
        p.datePassed = p.eta
          ? await window.maker.service('spell').getScheduledDate(p.source)
          : undefined;
        p.dateExecuted = p.executed
          ? await window.maker.service('spell').getExecutionDate(p.source)
          : undefined;
      }
      return p;
    })
  );
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
      payload: await extractProposalsAndGetSdkInfo(topics, network)
    });
    dispatch(formatHistoricalPolls(topics));
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
