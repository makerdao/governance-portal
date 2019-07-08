import { createReducer } from '../utils/redux';
import { formatRound } from '../utils/misc';
import { getWinningProp } from './proposals';

// Mock Poll Data ----------------------------------------------

const pollId1 = '1';
const pollId2 = '2';

const mockParsedAllPollsData = [
  {
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: pollId1,
    voteId: 'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4',
    blockCreated: 123456789,
    startTime: new Date('2019-07-05'),
    endTime: new Date('2019-07-10'),
    multiHash: 'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2'
  },
  {
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: pollId2,
    voteId: '8C411A89ED6D846F064ED0DECDBA3A857F0D1667',
    blockCreated: 123456789,
    startTime: new Date('2019-06-25'),
    endTime: new Date('2019-06-30'),
    multiHash: '8C411A89ED6D846F064ED0DECDBA3A857F0D1667',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2'
  }
];

const mockPollMd1 = {
  title: 'Mock Active Poll',
  summary:
    'The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which',
  options: ['abstain', '14%', '16%', 'no change', '18%', '20%'],
  content: `# Poll: POLL ONE

  The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which presents a number of possible Dai Stability Fee options. Voters are now able to signal their support for a Stability Fee within a range of 13.50% to 23.50%.
  
  This Governance Poll (FAQ) will be active for three days beginning on Monday, May 27 at 4 PM UTC, the results of which will inform an Executive Vote (FAQ) which will go live on Friday, May 31, at 4 PM UTC.
  `
};

const mockPollMd2 = {
  title: 'Mock Inactive Poll',
  summary:
    'The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which',
  discussionLink: 'https://www.reddit.com/r/mkrgov/',
  options: ['abstain', '14%', '16%', 'no change', '18%', '20%'],
  content: `# Poll: POLL TWO

  The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which presents a number of possible Dai Stability Fee options. Voters are now able to signal their support for a Stability Fee within a range of 13.50% to 23.50%.
  
  This Governance Poll (FAQ) will be active for three days beginning on Monday, May 27 at 4 PM UTC, the results of which will inform an Executive Vote (FAQ) which will go live on Friday, May 31, at 4 PM UTC.
  `
};

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

const fetchCmsData = async pollId => {
  // fetch the raw YAML & transform to POJO
  // format options as array of type: {id, name, percentage(vote breakdown)}
  // for now we mock:
  switch (pollId) {
    case pollId1:
      return mockPollMd1;
    case pollId2:
      return mockPollMd2;
    default:
      break;
  }
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
      const cmsData = await fetchCmsData(poll.pollId);
      const pollData = { ...poll, ...cmsData };

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
