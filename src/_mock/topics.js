export default {
  mainnet: [
    {
      topic: 'Foundation Proposal Governance Vote',
      id: 1,
      active: true,
      govVote: true,
      topic_blurb: `Here you can vote YES or NO to the proposed five core principles of the Maker Governance philosophy as <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018.
        This type of vote is a <strong style="font-weight:bold;font-style:oblique;">Governance Vote</strong>, and its objective is to represent resolution on a matter or collection of matters. This vote will not result in changes to the Dai Credit System (to change the state of the system, for example to change the debt ceiling, a second type of vote called an <strong style="font-weight:bold;font-style:oblique;">Executive Vote</strong> is used).`,
      end_timestamp: 1537027200000,
      date: '2018-03-12', //yyyy-mm-dd
      verified: true,
      submitted_by: {
        name: 'Dai Foundation',
        link: 'https://dai-dai-dai.now.sh/'
      },
      proposals: [
        {
          title:
            'Vote YES to the five core principles of the Maker Governance philosophy',
          proposal_blurb: `Voting for this proposal means voting YES to the five core principles of the Maker Governance philosophy as <a target="_blank" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018`,
          about: require('./yes-proposal.md'),
          source: '0x305505C8C9D51602f3Ebe0CE984aB2AEb0df3172',
          end_timestamp: 1537027200000,
          date: '2018-03-12', //yyyy-mm-dd
          verified: true,
          submitted_by: {
            name: 'Dai Foundation',
            link: 'https://dai-dai-dai.now.sh/'
          },
          documents: [
            {
              name: 'Risk...',
              link: 'https://...'
            }
          ]
        },
        {
          title:
            'Vote NO to the five core principles of the Maker Governance philosophy',
          proposal_blurb: `Voting for this proposal means voting NO to the five core principles of the Maker Governance philosophy as <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018`,
          about: require('./no-proposal.md'),
          source: '0xA9eB03F3a499E274170c378f958E4A0cBea2c7ef',
          end_timestamp: 1537027200000,
          date: '2018-03-12',
          verified: true,
          submitted_by: {
            name: 'Dai Foundation',
            link: 'https://dai-dai-dai.now.sh/'
          },
          documents: [
            {
              name: 'Risk...',
              link: 'https://...'
            }
          ]
        }
      ]
    }
  ],
  kovan: [
    {
      topic: 'Foundation Proposal Governance Vote',
      id: 1,
      active: true,
      govVote: true,
      topic_blurb: `Here you can vote YES or NO to the proposed five core principles of the Maker Governance philosophy as <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018
      This type of vote is a <strong style="font-weight:bold;font-style:oblique;">Governance Vote</strong>, and its objective is to represent resolution on a matter or collection of matters. This vote will not result in changes to the Dai Credit System (to change the state of the system, for example to change the debt ceiling, a second type of vote called an <strong style="font-weight:bold;font-style:oblique;">Executive Vote</strong> is used).`,
      end_timestamp: 1537027200000,
      date: 1536768000000, //yyyy-mm-dd
      verified: true,
      submitted_by: {
        name: 'Dai Foundation',
        link: 'https://dai-dai-dai.now.sh/'
      },
      proposals: [
        {
          title:
            'Vote YES to the five core principles of the Maker Governance philosophy',
          proposal_blurb: `Voting for this proposal means voting YES to the five core principles of the Maker Governance philosophy as <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018`,
          about: require('./yes-proposal.md'),
          source: '0x0c0fC0952790A96D60CD82cA865C7bb1233477C3',
          end_timestamp: 1537027200000,
          date: 1536768000000, //yyyy-mm-dd
          verified: true,
          submitted_by: {
            name: 'Dai Foundation',
            link: 'https://dai-dai-dai.now.sh/'
          },
          documents: [
            {
              name: 'Risk...',
              link: 'https://...'
            }
          ]
        },
        {
          title:
            'Vote NO to the five core principles of the Maker Governance philosophy',
          proposal_blurb: `Voting for this proposal means voting NO to the five core principles of the Maker Governance philosophy as <a target="_blank" rel="noopener noreferrer" href="https://medium.com/makerdao/foundation-proposal-v2-f10d8ee5fe8c"> updated on Medium</a> on August 21, 2018`,
          about: require('./no-proposal.md'),
          source: '0x66fF2801fDfEa24db2873abf977cA32226c175BD',
          end_timestamp: 1537027200000,
          date: 1536768000000,
          verified: true,
          submitted_by: {
            name: 'Dai Foundation',
            link: 'https://dai-dai-dai.now.sh/'
          },
          documents: [
            {
              name: 'Risk...',
              link: 'https://...'
            }
          ]
        }
      ]
    }
  ]
};
