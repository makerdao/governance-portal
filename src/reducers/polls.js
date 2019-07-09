import matter from 'gray-matter';
import { createReducer } from '../utils/redux';
import { formatRound } from '../utils/misc';
import { getWinningProp, check } from './proposals';

// Mock Poll Data ----------------------------------------------

const pollId1 = '1';
const pollId2 = '2';

const mockParsedAllPollsData = [
  {
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: pollId1,
    voteId: 'QmPLpuz1VMtAapZJCb84NtRRUHVFsxGiX6kdb1ewsXxSSi',
    blockCreated: 123456789,
    startTime: new Date('2019-06-25'),
    endTime: new Date('2019-06-30'),
    multiHash: 'QmPLpuz1VMtAapZJCb84NtRRUHVFsxGiX6kdb1ewsXxSSi',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2'
  },
  {
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: pollId2,
    voteId: 'QmbL3A3pz8j2NoWD18nt1PuKxqYh7Kk28jQK56nJaMcqcd',
    blockCreated: 123456789,
    startTime: new Date('2019-07-05'),
    endTime: new Date('2019-07-10'),
    multiHash: 'QmbL3A3pz8j2NoWD18nt1PuKxqYh7Kk28jQK56nJaMcqcd',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2'
  }
];

// Constants ----------------------------------------------

export const POLLS_REQUEST = 'polls/REQUEST';
export const POLLS_SUCCESS = 'polls/SUCCESS';
export const POLLS_FAILURE = 'polls/FAILURE';

// Actions ----------------------------------------------

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

// ---

const getAllWhiteListedPolls = async () => {
  //return window.maker.service('poll').getAllWhitelistedPolls();
  return mockParsedAllPollsData;
};

const fetchPollFromCms = async pollId => {
  const cmsDevUrl = 'http://0.0.0.0:3000';
  const cmsPath = 'content/governance-polling';

  const cmsUrl = `${cmsDevUrl}/${cmsPath}?voteId=${pollId}`;
  const res = await fetch(cmsUrl);
  await check(res);
  const json = await res.json();

  // TODO: fix CMS route to return an object, not an array
  return json[0];
};

const formatOptions = options => {
  const opts = Object.values(options);
  opts.shift();
  return Object.values(options);
};

const formatYamlToJson = data => {
  const json = matter(data.about);
  const { content } = json;
  const { title, summary, options, discussion_link } = json.data;
  return {
    title,
    summary,
    options: formatOptions(options),
    discussion_link,
    content
  };
};

const mockGetVoteHistory = async pollId => {
  const mockHistory1 = {
    time: new Date(),
    options: [
      {
        option: 1,
        mkr: 100,
        percentage: 50
      },
      {
        option: 2,
        mkr: 200,
        percentage: 25
      },
      {
        option: 3,
        mkr: 300,
        percentage: 25
      }
    ]
  };

  const mockHistory2 = {
    time: new Date(),
    options: [
      {
        option: 1,
        mkr: 2100,
        percentage: 25
      },
      {
        option: 2,
        mkr: 2200,
        percentage: 25
      },
      {
        option: 3,
        mkr: 2300,
        percentage: 25
      },
      {
        option: 4,
        mkr: 2400,
        percentage: 25
      }
    ]
  };

  switch (pollId) {
    case '1':
      return mockHistory1;
    case '2':
      return mockHistory2;
    default:
      return mockHistory1;
  }
};

export const getVoteBreakdown = async (pollId, options) => {
  // TODO replace this with SDK method:
  const { options: breakdownOpts } = await mockGetVoteHistory(pollId);

  const voteBreakdown = breakdownOpts.reduce((result, val) => {
    const currentOpt = options[val.option];
    const breakdown = {
      name: currentOpt,
      value: `${val.mkr} MKR (${val.percentage}%)`
    };
    result.push(breakdown);
    return result;
  }, []);

  return voteBreakdown;
};

const isPollActive = (startTime, endTime) => {
  const now = new Date();
  return startTime <= now && endTime > now ? true : false;
};

export const pollsInit = () => async dispatch => {
  // const pollService = window.maker.service('poll');
  dispatch(pollsRequest());

  const allPolls = [];
  try {
    const polls = await getAllWhiteListedPolls();

    for (const poll of polls) {
      const cmsData = await fetchPollFromCms(poll.voteId);
      const cmsPoll = formatYamlToJson(cmsData);

      const pollData = { ...poll, ...cmsPoll };

      // TODO keep track of these methods as the SDK methods are implemented
      // pollData.totalVotes = await pollService.getMkrAmtVoted(pollData.pollId);
      pollData.totalVotes = '1200';
      // pollData.participation = await pollService.getPercentageMkrVoted(
      //   pollData.pollId
      // );
      pollData.participation = '12';
      // pollData.numUniqueVoters = await pollService.numUniqueVoters(
      //   pollData.pollId
      // );
      pollData.numUniqueVoters = '700';
      pollData.active = isPollActive(pollData.startTime, pollData.endTime);
      if (!pollData.active) pollData.winningProposal = 'Mock Winning Proposal';
      // if (pollData.active) pollData.winningProposal = await pollService.getWinningProposal(pollData.pollId);

      const voteBreakdown = await getVoteBreakdown(
        pollData.pollId,
        pollData.options
      );
      pollData.voteBreakdown = voteBreakdown;

      allPolls.push(pollData);
    }
  } catch (error) {
    console.error(error);
    dispatch(pollsFailure());
  }

  dispatch(pollsSuccess(allPolls));
};

export const formatHistoricalPolls = topics => async (dispatch, getState) => {
  const govTopics = topics.filter(t => t.govVote === true);
  const allPolls = govTopics.reduce(
    (
      result,
      { active, end_timestamp, date, topic_blurb, topic, key, proposals }
    ) => {
      const winningProposal = getWinningProp(getState(), key);
      const options = proposals.map(p => p.title);
      const totalVotes = proposals.reduce(
        (acc, proposal) => acc + proposal.end_approvals,
        0
      );

      const poll = {
        legacyPoll: true,
        active,
        blockCreated: 'na',
        content: proposals[0] ? proposals[0].about : topic_blurb,
        creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
        endTime: new Date(end_timestamp),
        options: options,
        source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
        startTime: new Date(date),
        summary: topic_blurb,
        title: topic,
        totalVotes: formatRound(totalVotes),
        voteId: key,
        winningProposal: winningProposal
          ? winningProposal.title
          : 'Not applicable'
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

export default createReducer([], {
  [POLLS_SUCCESS]: (state, { payload }) => [...state, ...payload]
});

/**
 * 
about: "# About
active: false
date: "2019-04-29T00:00:00.000Z"
documents: []
end_approvals: 549.66
end_timestamp: 1556812800000
govVote: true
key: "signal-your-support-to-keep-the-stability-fee-set-to-16-5"
proposal_blurb: "Vote for this proposal to signal your support to keep the Stability Fee set to 16.5% per year"
source: "0x0c0fC0952790A96D60CD82cA865C7bb1233477C3"
submitted_by: {link: "https://-", name: "-"}
title: "Signal your support to keep the Stability Fee set to 16.5%"
topicKey: "poll-stability-fee-adjustment-april-29"
topicTitle: "Poll: Stability Fee Adjustment (April 29)"
verified: false
 */

/**OLD TOPIC
 * 
active: true
date: "2019-05-20T00:00:00.000Z"
end_timestamp: 1558627200000
govVote: true
key: "poll-stability-fee-adjustment-may-20-2019"
proposals: []
submitted_by: {link: "https://-", name: "-"}
topic: "Poll: Stability Fee Adjustment (May 20 2019)"
topic_blurb: "Poll: Stability Fee Adjustment (May 20 2019)"
verified: true
 */

/**NEW POLL
 * 
 * 
 * {
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: 0,
    blockCreated: 123456789,
    startTime: new Date(),
    endTime: new Date(),
    multiHash: 'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4'
  }
 */

/**MARKDOWN POLL
---
title: Stability Fee Adjustment (May 27 2019)
summary: The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which ...
discussion_link: https://www.reddit.com/r/mkrgov/
options:
    0: abstain
    1: 14%
    2: 16%
    3: no change
    4: 18%
    5: 20%
---

# Poll: Stability Fee Adjustment (May 27 2019)

The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which presents a number of possible Dai Stability Fee options. Voters are now able to signal their support for a Stability Fee within a range of 13.50% to 23.50%.

This Governance Poll (FAQ) will be active for three days beginning on Monday, May 27 at 4 PM UTC, the results of which will inform an Executive Vote (FAQ) which will go live on Friday, May 31, at 4 PM UTC.

...
  * 
  */
