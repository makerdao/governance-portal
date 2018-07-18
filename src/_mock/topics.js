export default {
  mainnet: [
    {
      topic: 'Foundation Proposal',
      active: true,
      topic_blurb:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
          proposal_blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
          about: require('./demo.md'),
          source: '0x305505C8C9D51602f3Ebe0CE984aB2AEb0df3172',
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
          proposal_blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
          about: require('./demo.md'),
          source: '0xA9eB03F3a499E274170c378f958E4A0cBea2c7ef',
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
    },
    {
      topic: 'OSM, Debt Ceiling',
      active: false,
      topic_blurb:
        'With the introduction of the OSMs, we add an additional layer of security to our price feeds. ETH/USD and MKR/USD prices are now delayed by one hour, so we have time to react in the event the price feeds are compromised.',
      date: '2018-03-12', //yyyy-mm-dd
      verified: true,
      submitted_by: {
        name: 'Dai Foundation',
        link: 'https://dai-dai-dai.now.sh/'
      },
      proposals: [
        {
          title:
            'Raise the Debt Ceiling to $100M, add a 1 hour time delay to price feed changes',
          proposal_blurb: `Yesterday there was a sudden spike in CDP creation and we saw, in the span of just a few hours, the largest amount of Dai created in the shortest time in our history. A total of 7 Million Dai was drawn across a few CDPs representing a 16.27% increase in circulating Dai.`,
          about: require('./raise-roof.md'),
          source: '0x8ffb52208c08d4254e06737be0e1f0fe271b76b2',
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
      topic: 'Foundation Proposal',
      active: true,
      topic_blurb:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
          proposal_blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
          about: require('./demo.md'),
          source: '0x0c0fC0952790A96D60CD82cA865C7bb1233477C3',
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
          proposal_blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
          about: require('./demo.md'),
          source: '0x66fF2801fDfEa24db2873abf977cA32226c175BD',
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
  ]
};
