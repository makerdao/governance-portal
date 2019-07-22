import matter from 'gray-matter';
import uniqBy from 'lodash.uniqby';
import { createReducer } from '../utils/redux';
import { formatRound, check } from '../utils/misc';
import { addToastWithTimeout, ToastTypes } from './toasts';
import { TransactionStatus } from '../utils/constants';

// Mock Poll Data ----------------------------------------------

// Mocked poll data from the SDK/plugin
// const mockParsedAllPollsData = [
//   {
//     creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
//     pollId: '1',
//     blockCreated: 123456789,
//     startTime: new Date('2019-06-25'),
//     endTime: new Date('2019-06-30'),
//     multiHash: 'QmbL3A3pz8j2NoWD18nt1PuKxqYh7Kk28jQK56nJaMcqcd',
//     source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
//     url:
//       'https://cms-gov.makerfoundation.com/content/governance-polling?pollId=1'
//   },
//   {
//     creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
//     pollId: '2',
//     blockCreated: 123456789,
//     startTime: new Date('2019-07-09'),
//     endTime: new Date('2019-07-23'),
//     multiHash: 'QmPLpuz1VMtAapZJCb84NtRRUHVFsxGiX6kdb1ewsXxSSi',
//     source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
//     url:
//       'https://cms-gov.makerfoundation.com/content/governance-polling?pollId=2'
//   }
// ];

// Mock polls from the CMS
// const mockPollMd1 = {
//   about: `---
// title: Test Poll Inactive 1 (June 1)
// summary: This is a poll that ended in the past, and is inactive.
// discussion_link: https://www.reddit.com/r/mkrgov/
// rules:
// options:
//    0: Abstain
//    1: No Change
//    2: Vote Yes
//    3: Vote No
// ---
// # Poll: Test Poll Inactive 1 (June 1)

// This is a test poll that ended in the past, and is inactive. This text is dummy data.

// The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which presents a number of possible Dai Stability Fee options. Voters are now able to signal their support for a Stability Fee within a range of 13.50% to 23.50%.

// This Governance Poll (FAQ) will be active for three days beginning on Monday, May 27 at 4 PM UTC, the results of which will inform an Executive Vote (FAQ) which will go live on Friday, May 31, at 4 PM UTC.`
// };

// const mockPollMd2 = {
//   about: `---
// title: Test Poll Active 1 (Jul 9)
// summary: This is a poll that is active for a week starting July 9th.
// discussion_link: https://www.reddit.com/r/mkrgov/
// rules:
// options:
//    0: Abstain
//    1: No Change
//    2: 5%
//    3: 25%
//    4: 75%
// ---
// # Poll: Test Poll Active 1 (Jul 9)

// This is a poll that is active for a week starting July 9th. This text is dummy data.

// The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which presents a number of possible Dai Stability Fee options. Voters are now able to signal their support for a Stability Fee within a range of 13.50% to 23.50%.

// This Governance Poll (FAQ) will be active for three days beginning on Monday, May 27 at 4 PM UTC, the results of which will inform an Executive Vote (FAQ) which will go live on Friday, May 31, at 4 PM UTC.`
// };

// Mock voteHistory:
// const mockHistory1 = {
//   time: new Date(),
//   options: [
//     {
//       option: 1,
//       mkr: 100,
//       percentage: 50
//     },
//     {
//       option: 2,
//       mkr: 200,
//       percentage: 25
//     },
//     {
//       option: 3,
//       mkr: 300,
//       percentage: 25
//     }
//   ]
// };

// const mockHistory2 = {
//   time: new Date(),
//   options: [
//     {
//       option: 1,
//       mkr: 2100,
//       percentage: 25
//     },
//     {
//       option: 2,
//       mkr: 2200,
//       percentage: 25
//     },
//     {
//       option: 3,
//       mkr: 2300,
//       percentage: 25
//     },
//     {
//       option: 4,
//       mkr: 2400,
//       percentage: 25
//     }
//   ]
// };

// const mockFetchPollFromCms = async pollId => {
//   switch (pollId) {
//     case '1':
//       return mockPollMd1;
//     case '2':
//       return mockPollMd2;
//     default:
//       break;
//   }
// };

// const mockGetVoteHistory = async pollId => {
//   switch (pollId) {
//     case '1':
//       return mockHistory1;
//     case '2':
//       return mockHistory2;
//     default:
//       return mockHistory1;
//   }
// };
// Constants ----------------------------------------------

export const POLLS_REQUEST = 'polls/REQUEST';
export const POLLS_SUCCESS = 'polls/SUCCESS';
export const POLLS_FAILURE = 'polls/FAILURE';

export const POLL_VOTE_REQUEST = 'poll/VOTE_REQUEST';
export const POLL_VOTE_SENT = 'poll/VOTE_SENT';
export const POLL_VOTE_SUCCESS = 'poll/VOTE_SUCCESS';
export const POLL_VOTE_FAILURE = 'poll/VOTE_FAILURE';

export const POLLS_SET_OPTION_VOTING_FOR = 'polls/SET_OPTION_VOTING_FOR';

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
        resolve();
      },
      error: (_, err) => {
        dispatch({ type: `poll/${prefix}_FAILURE`, payload: err });
        dispatch(addToastWithTimeout(ToastTypes.ERROR, err));
        resolve();
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

export const setOptionVotingFor = (pollId, optionId) => ({
  type: POLLS_SET_OPTION_VOTING_FOR,
  payload: { pollId, optionId }
});

// Writes ---

export const voteForPoll = (pollId, optionId) => async dispatch => {
  dispatch({ type: POLL_VOTE_REQUEST });

  const pollVote = window.maker.service('govPolling').vote(pollId, optionId);
  await handleTx({
    txObject: pollVote,
    prefix: 'VOTE',
    dispatch
  });
  dispatch(setOptionVotingFor(pollId, optionId));
};

export const withdrawVoteForPoll = pollId => async dispatch => {
  dispatch({ type: POLL_VOTE_REQUEST });

  const pollVote = window.maker.service('govPolling').vote(pollId, 0);
  await handleTx({
    txObject: pollVote,
    prefix: 'VOTE',
    dispatch
  });

  dispatch(setOptionVotingFor(pollId, 0));
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

export const getVoteBreakdown = async (pollId, options) => {
  // const { options: breakdownOpts } = await mockGetVoteHistory(pollId);

  const voteHistory = await window.maker
    .service('govPolling')
    .getVoteHistory(pollId);
  console.log('^^6voteHistory', voteHistory[0].options);

  const voteBreakdown = voteHistory[0].options.reduce((result, val) => {
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

      //working
      const voteBreakdown = await getVoteBreakdown(
        pollData.pollId,
        pollData.options
      );
      pollData.voteBreakdown = voteBreakdown;

      // TODO: pull the Polling address from the correct json file
      pollData.source = '0x518a0702701BF98b5242E73b2368ae07562BEEA3';

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
