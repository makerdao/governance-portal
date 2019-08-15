import matter from 'gray-matter';
import uniqBy from 'lodash.uniqby';
import throttle from 'lodash/throttle';
import { createReducer } from '../utils/redux';
import { formatRound, check } from '../utils/misc';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { TransactionStatus } from '../utils/constants';
import { generateIPFSHash } from '../utils/ipfs';

// Constants ----------------------------------------------

export const POLLS_REQUEST = 'polls/REQUEST';
export const POLLS_SUCCESS = 'polls/SUCCESS';
export const POLLS_FAILURE = 'polls/FAILURE';

export const LEGACY_POLLS_SUCCESS = 'polls/LEGACY_POLLS_SUCCESS';

export const POLL_VOTE_REQUEST = 'poll/VOTE_REQUEST';
export const POLL_VOTE_SENT = 'poll/VOTE_SENT';
export const POLL_VOTE_SUCCESS = 'poll/VOTE_SUCCESS';
export const POLL_VOTE_FAILURE = 'poll/VOTE_FAILURE';

export const POLLS_SET_OPTION_VOTING_FOR = 'polls/SET_OPTION_VOTING_FOR';
export const ADD_POLL = 'poll/ADD_POLL';
export const UPDATE_POLL = 'polls/UPDATE_POLL';

// Actions ----------------------------------------------

const handleTx = ({ prefix, dispatch, txObject }) =>
  new Promise(resolve => {
    const txMgr = window.maker.service('transactionManager');
    txMgr.listen(txObject, {
      pending: tx => {
        dispatch({
          type: `poll/${prefix}_SENT`,
          payload: { txHash: tx.hash }
        });
      },
      mined: _ => {
        dispatch({ type: `poll/${prefix}_SUCCESS` });
        resolve(true);
      },
      error: (_, err) => {
        dispatch({ type: `poll/${prefix}_FAILURE`, payload: err });
        dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
        resolve(false);
      }
    });
  });

export const legacyPollsSuccess = polls => ({
  type: LEGACY_POLLS_SUCCESS,
  payload: polls
});
export const pollsRequest = () => ({
  type: POLLS_REQUEST
});
export const pollsSuccess = () => ({
  type: POLLS_SUCCESS
});
export const pollsFailure = () => ({
  type: POLLS_FAILURE
});

export const addPoll = poll => ({
  type: ADD_POLL,
  payload: poll
});

export const updatePoll = (pollId, pollDataUpdates) => ({
  type: UPDATE_POLL,
  payload: { pollId, pollDataUpdates }
});

export const setOptionVotingFor = (pollId, optionId) => ({
  type: POLLS_SET_OPTION_VOTING_FOR,
  payload: { pollId, optionId }
});

// Writes ---

export const voteForPoll = (pollId, optionId) => async dispatch => {
  dispatch({ type: POLL_VOTE_REQUEST });

  // increment the optionId to give the plugin the correct ID
  const optionIdToVoteFor = parseInt(optionId) + 1;
  const pollVote = window.maker
    .service('govPolling')
    .vote(pollId, optionIdToVoteFor);
  const success = await handleTx({
    txObject: pollVote,
    prefix: 'VOTE',
    dispatch
  });

  if (success) {
    dispatch(setOptionVotingFor(pollId, optionId));
    dispatch(updateVoteBreakdown(pollId));
  }
};

export const withdrawVoteForPoll = pollId => async dispatch => {
  dispatch({ type: POLL_VOTE_REQUEST });

  const pollVote = window.maker.service('govPolling').vote(pollId, 0);
  const success = await handleTx({
    txObject: pollVote,
    prefix: 'VOTE',
    dispatch
  });

  if (success) {
    dispatch(setOptionVotingFor(pollId, null));
    dispatch(updateVoteBreakdown(pollId));
  }
};

// Reads ---

const getAllWhiteListedPolls = async () => {
  const pollsList = await window.maker
    .service('govPolling')
    .getAllWhitelistedPolls();

  const uniqPolls = uniqBy(pollsList, p => p.multiHash);
  // Don't process polls where startDate is in the future
  const polls = uniqPolls.filter(poll => poll.startDate <= new Date());
  return polls;
};

export const getOptionVotingFor = (address, pollId) => async dispatch => {
  let optionId = await window.maker
    .service('govPolling')
    .getOptionVotingFor(address, pollId);

  // Option "0" from the plugin is "abstain", but the FE doesn't use "abstain".
  if (optionId === 0) optionId = null;
  else optionId = parseInt(optionId) - 1;
  dispatch(setOptionVotingFor(pollId, optionId));
};

const fetchPollFromUrl = async url => {
  const res = await fetch(url);
  await check(res);
  const contentType = res.headers.get('content-type');
  if (!contentType) return null;
  if (contentType.indexOf('application/json') !== -1) {
    const json = await res.json();
    if (!json.about || typeof json.about !== 'string') return null;
    return json;
  } else if (contentType.indexOf('text/plain') !== -1) {
    return res.text();
  } else return null;
};

const formatOptions = options => {
  const optionVals = Object.values(options);
  // Remove option 0: abstain
  optionVals.shift();
  return optionVals;
};

const formatYamlToJson = async data => {
  const json = data.about ? matter(data.about) : matter(data);
  if (!json.data.title || !json.data.options)
    throw new Error(
      'Invalid poll document: no options or title field found in front matter'
    );
  const { content } = json;
  const { title, summary, options, discussion_link } = json.data;
  return {
    voteId: data.voteId
      ? data.voteId
      : await generateIPFSHash(data.replace(/(\r\n|\n|\r)/gm, '\n'), {
          encoding: 'ascii'
        }),
    title,
    summary,
    options: formatOptions(options),
    discussion_link,
    content,
    rawData: data.about || data
  };
};

const isPollActive = (startDate, endDate) => {
  const now = new Date();
  return startDate <= now && endDate > now ? true : false;
};

export const updateVoteBreakdown = pollId => (dispatch, getState) => {
  const poll = getState().polling.polls.find(poll => poll.pollId === pollId);
  if (!poll) return;
  const { options, endDate } = poll;
  async function checkForVoteBreakdownUpdates(triesRemaining) {
    if (triesRemaining === 0) return;
    const voteBreakdown = await getVoteBreakdown(pollId, options, endDate);
    const totalVotes = await getTotalVotes(pollId);
    const participation = await getParticipation(pollId);
    const numUniqueVoters = await getNumUniqueVoters(pollId);
    dispatch(
      updatePoll(pollId, {
        voteBreakdown,
        totalVotes,
        participation,
        numUniqueVoters
      })
    );
    setTimeout(() => checkForVoteBreakdownUpdates(triesRemaining - 1), 1000);
  }

  const NUM_TRIES = 6;
  checkForVoteBreakdownUpdates(NUM_TRIES);
};

export const getVoteBreakdown = async (pollId, options, endDate) => {
  // returns either the block on which this poll ended,
  // or, if the poll hasn't ended, the current block
  const pollEndBlock = await window.maker
    .service('govQueryApi')
    .getBlockNumber(Math.floor(endDate.getTime() / 1000));

  const mkrSupport = await window.maker
    .service('govQueryApi')
    .getMkrSupport(pollId, pollEndBlock);

  const voteBreakdown = options.reduce((result, val, index) => {
    // correct for option 0: abstain here:
    const matchingOption = mkrSupport.find(
      x => parseInt(x.optionId) - 1 === index
    );
    const value = matchingOption
      ? `${formatRound(matchingOption.mkrSupport, 2)} MKR (${formatRound(
          matchingOption.percentage
        )}%)`
      : '0 MKR (0.00%)';

    const mkrSupportData = matchingOption
      ? {
          mkrSupport: matchingOption.mkrSupport,
          percentage: formatRound(matchingOption.percentage)
        }
      : { mkrSupport: '0', percentage: '0' };
    const breakdown = {
      name: val,
      optionId: index,
      value,
      ...mkrSupportData
    };
    result.push(breakdown);
    return result;
  }, []);

  voteBreakdown.sort((a, b) => a.optionId - b.optionId);

  return voteBreakdown;
};

const SPOCK_THROTTLE = 2000; // invoke spock query at most once per every 2s

export const getTotalVotes = throttle(async pollId => {
  const totalVotes = await window.maker
    .service('govPolling')
    .getMkrAmtVoted(pollId);
  return totalVotes.toNumber();
}, SPOCK_THROTTLE);

export const getParticipation = throttle(async pollId => {
  const participation = await window.maker
    .service('govPolling')
    .getPercentageMkrVoted(pollId);
  return participation;
}, SPOCK_THROTTLE);

export const getNumUniqueVoters = throttle(async pollId => {
  const numUniqueVoters = await window.maker
    .service('govPolling')
    .getNumUniqueVoters(pollId);
  return numUniqueVoters;
}, SPOCK_THROTTLE);

export const getWinningProposal = throttle(async pollId => {
  const winningProposal = window.maker
    .service('govPolling')
    .getWinningProposal(pollId);
  return winningProposal;
}, SPOCK_THROTTLE);

export const pollsInit = () => async dispatch => {
  dispatch(pollsRequest());

  try {
    const polls = await getAllWhiteListedPolls();

    let pollsRemaining = polls.length;
    function onPollFetchAttempt() {
      pollsRemaining--;
      if (pollsRemaining === 0) dispatch(pollsSuccess());
    }
    for (const poll of polls) {
      fetchPollFromUrl(poll.url)
        .then(async pollDocument => {
          if (pollDocument === null)
            throw new Error(
              `Error fetching data for poll with ID ${poll.pollId}`
            );
          try {
            const documentData = await formatYamlToJson(pollDocument);
            const pollData = { ...poll, ...documentData };
            pollData.active = isPollActive(
              pollData.startDate,
              pollData.endDate
            );
            pollData.source = window.maker
              .service('smartContract')
              .getContract('POLLING').address;
            dispatch(addPoll(pollData));
          } catch (e) {
            throw e;
          }
        })
        .catch(e => console.error(e))
        .finally(onPollFetchAttempt);
    }
  } catch (error) {
    console.error(error);
    dispatch(pollsFailure());
  }
};

export const pollDataInit = poll => dispatch => {
  if (!poll) return;
  const { pollId, options, endDate, active } = poll;
  getTotalVotes(pollId).then(totalVotes =>
    dispatch(updatePoll(pollId, { totalVotes }))
  );
  getParticipation(pollId).then(participation =>
    dispatch(updatePoll(pollId, { participation }))
  );
  getNumUniqueVoters(pollId).then(numUniqueVoters =>
    dispatch(updatePoll(pollId, { numUniqueVoters }))
  );
  getWinningProposal(pollId).then(proposalId => {
    const winningProposal = proposalId === 0 ? null : parseInt(proposalId) - 1;
    if (!active && winningProposal !== null)
      dispatch(updatePoll(pollId, { winningProposal }));
  });

  dispatch(updatePoll(pollId, { voteBreakdownFetching: true }));
  getVoteBreakdown(pollId, options, endDate).then(voteBreakdown =>
    dispatch(
      updatePoll(pollId, { voteBreakdown, voteBreakdownFetching: false })
    )
  );
};

export const formatHistoricalPolls = topics => async dispatch => {
  const govTopics = topics.filter(t => t.govVote === true);
  const allPolls = govTopics.reduce(
    (result, { end_timestamp, date, topic_blurb, topic, key, proposals }) => {
      const options = proposals.map(p => p.title);
      const totalVotes = proposals.reduce(
        (acc, proposal) => acc + proposal.end_approvals,
        0
      );

      const poll = {
        legacyPoll: true,
        active: false,
        content: proposals[0] ? proposals[0].about : topic_blurb,
        endDate: new Date(end_timestamp),
        options: options,
        source:
          proposals[0] && proposals[0].source
            ? proposals[0].source
            : window.maker.service('smartContract').getContract('POLLING')
                .address,
        startDate: new Date(date),
        summary: topic_blurb,
        title: topic,
        totalVotes: formatRound(totalVotes, 2),
        pollId: key,
        voteId: key,
        topicKey: key
      };

      result.push(poll);
      return result;
    },
    []
  );
  dispatch(legacyPollsSuccess(allPolls));
};

// Reducer ------------------------------------------------

const initialState = {
  polls: [],
  voteTxHash: '',
  voteTxStatus: TransactionStatus.NOT_STARTED
};

export default createReducer(initialState, {
  [LEGACY_POLLS_SUCCESS]: (state, { payload }) => ({
    ...state,
    polls: [...state.polls, ...payload]
  }),
  [POLLS_REQUEST]: state => ({
    ...state,
    pollsFetching: true
  }),
  [POLLS_SUCCESS]: state => ({
    ...state,
    pollsFetching: false
  }),
  [POLLS_FAILURE]: state => ({
    ...state,
    pollsFetching: false
  }),
  [POLL_VOTE_REQUEST]: state => ({
    ...state,
    voteTxHash: '',
    voteTxStatus: TransactionStatus.NOT_STARTED
  }),
  [ADD_POLL]: (state, { payload }) => ({
    ...state,
    polls: [...state.polls, payload]
  }),
  [UPDATE_POLL]: (state, { payload }) => ({
    ...state,
    polls: state.polls.map(poll =>
      poll.pollId === payload.pollId
        ? { ...poll, ...payload.pollDataUpdates }
        : poll
    )
  }),
  [POLL_VOTE_SENT]: (state, { payload }) => ({
    ...state,
    voteTxHash: payload.txHash,
    voteTxStatus: TransactionStatus.PENDING
  }),
  [POLL_VOTE_SUCCESS]: state => ({
    ...state,
    voteTxStatus: TransactionStatus.MINED
  }),
  [POLL_VOTE_FAILURE]: state => ({
    ...state,
    voteTxStatus: TransactionStatus.ERROR
  }),
  [POLLS_SET_OPTION_VOTING_FOR]: (state, { payload }) => {
    return {
      ...state,
      polls: state.polls.map(poll => {
        if (poll.pollId === payload.pollId) {
          return {
            ...poll,
            optionVotingFor: payload.optionId
          };
        }
        return poll;
      })
    };
  }
});
