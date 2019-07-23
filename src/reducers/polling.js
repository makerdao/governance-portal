import matter from 'gray-matter';
import uniqBy from 'lodash.uniqby';
import { createReducer } from '../utils/redux';
import { formatRound, check } from '../utils/misc';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { TransactionStatus } from '../utils/constants';

// Constants ----------------------------------------------

export const POLLS_REQUEST = 'polls/REQUEST';
export const POLLS_SUCCESS = 'polls/SUCCESS';
export const POLLS_FAILURE = 'polls/FAILURE';

export const POLL_VOTE_REQUEST = 'poll/VOTE_REQUEST';
export const POLL_VOTE_SENT = 'poll/VOTE_SENT';
export const POLL_VOTE_SUCCESS = 'poll/VOTE_SUCCESS';
export const POLL_VOTE_FAILURE = 'poll/VOTE_FAILURE';

export const POLLS_SET_OPTION_VOTING_FOR = 'polls/SET_OPTION_VOTING_FOR';
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

export const pollsRequest = () => ({
  type: POLLS_REQUEST
});
export const pollsSuccess = polls => ({
  type: POLLS_SUCCESS,
  payload: polls
});
export const pollsFailure = () => ({
  type: POLLS_FAILURE
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

  const pollVote = window.maker.service('govPolling').vote(pollId, optionId);
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
    dispatch(setOptionVotingFor(pollId, 0));
    dispatch(updateVoteBreakdown(pollId));
  }
};

// Reads ---

const getAllWhiteListedPolls = async () => {
  const pollsList = await window.maker
    .service('govPolling')
    .getAllWhitelistedPolls();

  const polls = uniqBy(pollsList, p => p.url);
  console.log('unique polls', polls);
  return polls;
};

export const getOptionVotingFor = (address, pollId) => async dispatch => {
  const optionId = await window.maker
    .service('govPolling')
    .getOptionVotingFor(address, pollId);
  dispatch(setOptionVotingFor(pollId, optionId));
};

const fetchPollFromUrl = async url => {
  console.log('url to fetch', url);
  const res = await fetch(url);
  await check(res);
  const json = await res.json();
  if (!json['voteId']) {
    return null;
  } else {
    console.log('valid poll', json);
    return json;
  }
};

const formatOptions = options => {
  return Object.values(options);
};

const formatYamlToJson = data => {
  const json = matter(data.about);
  const { content } = json;
  const { title, summary, options, discussion_link } = json.data;
  return {
    voteId: data.voteId,
    title,
    summary,
    options: formatOptions(options),
    discussion_link,
    content,
    rawData: data.about
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
    dispatch(updatePoll(pollId, { voteBreakdown }));
    setTimeout(() => checkForVoteBreakdownUpdates(triesRemaining - 1), 1000);
  }

  const NUM_TRIES = 6;
  checkForVoteBreakdownUpdates(NUM_TRIES);
};

export const getVoteBreakdown = async (pollId, options, endDate) => {
  // const { options: breakdownOpts } = await mockGetVoteHistory(pollId);

  // returns either the block on which this poll ended,
  // or, if the poll hasn't ended, the current block
  const pollEndBlock = await window.maker
    .service('govQueryApi')
    .getBlockNumber(Math.floor(endDate.getTime() / 1000));

  const mkrSupport = await window.maker
    .service('govQueryApi')
    .getMkrSupport(pollId, pollEndBlock);

  const voteBreakdown = mkrSupport.reduce((result, val) => {
    const currentOpt = options[val.optionId];
    const breakdown = {
      name: currentOpt,
      value: `${val.mkrSupport} MKR (${formatRound(val.percentage)}%)`,
      optionId: val.optionId
    };
    result.push(breakdown);
    return result;
  }, []);

  voteBreakdown.sort((a, b) => a.optionId - b.optionId);

  return voteBreakdown;
};

export const pollsInit = () => async dispatch => {
  const pollService = window.maker.service('govPolling');
  dispatch(pollsRequest());

  const allPolls = [];

  try {
    const polls = await getAllWhiteListedPolls();
    console.log('Whitelisted Polls', polls);

    for (const poll of polls) {
      let pollData;
      try {
        const cmsData = await fetchPollFromUrl(poll.url);
        if (cmsData === null) continue;
        const cmsPoll = formatYamlToJson(cmsData);
        pollData = { ...poll, ...cmsPoll };
      } catch (e) {
        console.error(`Poll ID: ${poll.pollId}`, e);
        continue;
      }

      //working
      const totalVotes = await pollService.getMkrAmtVoted(pollData.pollId);
      console.log('^^1totalVotes', totalVotes.toNumber());
      pollData.totalVotes = totalVotes.toNumber();

      // working
      // TODO check why percentage seems off, is it caused by block sync issue?
      const participation = await pollService.getPercentageMkrVoted(
        pollData.pollId
      );
      console.log('^^2participation', participation);
      pollData.participation = participation;

      //working
      const numUniqueVoters = await pollService.getNumUniqueVoters(
        pollData.pollId
      );
      pollData.numUniqueVoters = numUniqueVoters;

      // working
      pollData.active = isPollActive(pollData.startDate, pollData.endDate);
      const winningProposal = await pollService.getWinningProposal(
        pollData.pollId
      );
      if (!pollData.active) pollData.winningProposal = winningProposal;

      // working
      const voteBreakdown = await getVoteBreakdown(
        pollData.pollId,
        pollData.options,
        pollData.endDate
      );
      pollData.voteBreakdown = voteBreakdown;

      pollData.source = window.maker
        .service('smartContract')
        .getContract('POLLING').address;

      allPolls.push(pollData);
    }
  } catch (error) {
    console.error(error);
    dispatch(pollsFailure());
  }

  dispatch(pollsSuccess(allPolls));
};

export const formatHistoricalPolls = topics => async dispatch => {
  const govTopics = topics.filter(t => t.govVote === true);
  const allPolls = govTopics.reduce(
    (
      result,
      { active, end_timestamp, date, topic_blurb, topic, key, proposals }
    ) => {
      const options = proposals.map(p => p.title);
      const totalVotes = proposals.reduce(
        (acc, proposal) => acc + proposal.end_approvals,
        0
      );

      const poll = {
        legacyPoll: true,
        active: false,
        blockCreated: 'na',
        content: proposals[0] ? proposals[0].about : topic_blurb,
        creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
        endDate: new Date(end_timestamp),
        options: options,
        source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
        startDate: new Date(date),
        summary: topic_blurb,
        title: topic,
        totalVotes: formatRound(totalVotes),
        pollId: key,
        voteId: key,
        topicKey: key
        // multiHash: 'na',
        // discussionLink: 'https://www.reddit.com/r/mkrgov/',
        // numUniqueVoters: '700',
        // participation: '12',
        // pollId: '2',
      };

      result.push(poll);
      return result;
    },
    []
  );
  dispatch(pollsSuccess(allPolls));
};

// Reducer ------------------------------------------------

const initialState = {
  polls: [],
  voteTxHash: '',
  voteTxStatus: TransactionStatus.NOT_STARTED
};

export default createReducer(initialState, {
  [POLLS_SUCCESS]: (state, { payload }) => ({
    ...state,
    polls: [...state.polls, ...payload]
  }),
  [POLL_VOTE_REQUEST]: state => ({
    ...state,
    voteTxHash: '',
    voteTxStatus: TransactionStatus.NOT_STARTED
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
