import { createReducer } from '../utils/redux';

// Constants ----------------------------------------------

export const TOPICS_SUCCESS = 'topics/SUCCESS';

// Actions ----------------------------------------------

// Mock Poll Data ----------------------------------------------

const topics = [
  {
    title: 'Stability Fee Adjustment (May 27 2019)',
    summary:
      'The Maker Foundation Interim Risk Team has placed a Governance Poll into the voting system which',
    options: {
      0: 'abstain',
      1: '14%',
      2: '16%',
      3: 'no change',
      4: '18%',
      5: '20%'
    },
    content: 'some content here',
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2', // where does this come from?
    pollId: 0,
    voteId: 'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4',
    blockCreated: 123456789,
    startTime: new Date(),
    endTime: new Date(),
    multiHash: 'QmaozNR7DZHQK1ZcU9p7QdrshMvXqWK6gpu5rmrkPdT3L4',
    active: true
  },
  {
    title: 'Poll 2',
    summary:
      'Bunch of fake text for a fake poll that is being used to mock the ui so it looks like theres something written here',
    options: {
      0: 'abstain',
      1: '14%',
      2: '16%',
      3: 'no change',
      4: '18%',
      5: '20%'
    },
    content: 'some content here',
    creator: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    source: '0xeda95d1bdb60f901986f43459151b6d1c734b8a2',
    pollId: 0,
    voteId: '8C411A89ED6D846F064ED0DECDBA3A857F0D1667',
    blockCreated: 123456789,
    startTime: new Date(),
    endTime: new Date(),
    multiHash: '8C411A89ED6D846F064ED0DECDBA3A857F0D1667',
    active: false
  }
];

export const topicsSuccess = () => ({
  type: TOPICS_SUCCESS,
  payload: topics
});

// Reducer ------------------------------------------------

export default createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => payload || []
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
