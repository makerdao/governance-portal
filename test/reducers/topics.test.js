import { topicsInit } from '../../src/reducers/topics';

const dateRegex = '^\\d{4}-\\d{2}-\\d{2}$';

test('topicsInit returns a TOPICS_SUCCESS action with topics as a payload', async () => {
  const dispatch = jest.fn();
  await topicsInit('mainnet')(dispatch);

  expect(dispatch.mock.calls.length).toBe(2);
  expect(dispatch.mock.calls[0][0]).toEqual({
    type: 'topics/TOPICS_SUCCESS',
    payload: expect.arrayContaining([
      {
        topic: expect.any(String),
        id: expect.any(Number),
        active: expect.any(Boolean),
        govVote: expect.any(Boolean),
        topic_blurb: expect.any(String),
        end_timestamp: expect.any(Number),
        date: expect.stringMatching(dateRegex),
        verified: expect.any(Boolean),
        submitted_by: {
          name: expect.any(String),
          link: expect.any(String)
        },
        proposals: expect.arrayContaining([
          {
            title: expect.any(String),
            proposal_blurb: expect.any(String),
            about: expect.any(String),
            source: expect.any(String),
            end_timestamp: expect.any(Number),
            date: expect.stringMatching(dateRegex),
            verified: expect.any(Boolean),
            submitted_by: {
              name: expect.any(String),
              link: expect.any(String)
            },
            documents: expect.arrayContaining([
              {
                name: expect.any(String),
                link: expect.any(String)
              }
            ])
          }
        ])
      }
    ])
  });
});
