/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import { createReducer } from "../utils/redux";

// Selectors ----------------------------------------------

// Reducer ------------------------------------------------

// date: "2018-04-20",, slug, description
// "dates": {
//   "start": "2017-10-02",
//   "end": "2017-10-03"
// }

const mockedBackend = [
  {
    topic: "Foundation Proposal",
    active: true,
    topic_blurb: "Lorem...",
    proposals: [
      {
        title:
          "Vote YES to the five core principals of the Maker Governance philosophy",
        blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
        about: "https://...somthing.md",
        source: "0x8ffb52208c08d4254e06737be0e1f0fe271b76b2",
        created: "12 Mar 2018",
        verified: true,
        submitted_by: {
          name: "Dai Foundation",
          link: "https://makerdao.com"
        },
        documents: [
          {
            name: "Risk...",
            link: "https://..."
          }
        ]
      },
      {
        title:
          "Vote NO to the five core principals of the Maker Governance philosophy",
        blurb: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vehicula sapien mi, vitae suscipit felis pellentesque a. Aenean condimentum vitae neque quis sagittis. Duis nec purus neque. Duis quis ultricies magna, in facilisis nisl. Suspendisse aliquet nisl et nisl mattis dictum. Donec varius sed lacus sit amet mollis. `,
        about: "https://...somthing.md",
        source: "0x0000000000000000000000000000000000000000",
        created: "12 Mar 2018",
        verified: true,
        submitted_by: {
          name: "Dai Foundation",
          link: "https://makerdao.com"
        },
        documents: [
          {
            name: "Risk...",
            link: "https://..."
          }
        ]
      }
    ]
  }
];

const mock = createReducer(mockedBackend, {});

export default mock;
