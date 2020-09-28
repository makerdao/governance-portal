import { proposalsInit } from '../../src/reducers/proposals';
import each from 'jest-each';

const dateRegex = '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}.\\d{3}Z$';

const mockGetEta = jest.fn(async () => new Date('2020-02-04T11:35:48.000Z'));
const mockGetDone = jest.fn(async () => true);
const mockGetScheduledDate = jest.fn(
  async () => new Date('2020-02-03T11:35:48.000Z')
);
const mockGetExecutionDate = jest.fn(
  async () => new Date('2020-02-04T11:36:48.000Z')
);

// MOCK WEB3 AND SPELL SERVICE
beforeAll(() => {
  const mockProvider = {
    sendAsync: ({ method }, callback) => {
      if (method === 'eth_accounts') {
        callback(null, { result: ['0xf00'] });
      }
    }
  };
  window.web3 = {
    currentProvider: mockProvider,
    eth: {
      defaultAccount: '0xf00bae'
    }
  };
  window.ethereum = {
    enable: async () => {
      window.ethereum['sendAsync'] = mockProvider.sendAsync;
    }
  };

  const mockService = name => {
    if (name === 'spell')
      return {
        getEta: mockGetEta,
        getDone: mockGetDone,
        getScheduledDate: mockGetScheduledDate,
        getExecutionDate: mockGetExecutionDate
      };
  };
  window.maker = {
    service: jest.fn(mockService)
  };
});

afterAll(() => {
  delete window.web3;
  delete window.ethereum;
});

test('proposalsInit dispatches a FAILURE action when it cannot reach the backend', async () => {
  // SETUP
  const oldFetch = fetch;
  global.fetch = require('jest-fetch-mock');

  const dispatch = jest.fn();
  process.env.REACT_APP_GOV_BACKEND = 'prod';
  fetch.mockResponse('', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' }
  });

  // EXERCISE
  await proposalsInit('mainnet')(dispatch);

  // ASSERT
  expect(fetch.mock.calls.length).toBe(5);
  expect(dispatch.mock.calls.length).toBe(2);
  expect(dispatch.mock.calls[0][0]).toEqual({
    type: 'proposals/REQUEST',
    payload: {}
  });
  expect(dispatch.mock.calls[1][0]).toEqual({
    type: 'proposals/FAILURE',
    payload: { error: expect.any(Error) }
  });

  // TEARDOWN
  global.fetch = oldFetch;
});

each([
  ['mainnet', 'mock'],
  ['kovan', 'mock'],
  ['mainnet', 'prod'],
  ['kovan', 'prod']
]).test(
  'proposalsInit dispatches a SUCCESS action when it can reach the backend (%s / %s)',
  async (network, backend) => {
    const dispatch = jest.fn();
    process.env.REACT_APP_GOV_BACKEND = backend;

    await proposalsInit(network)(dispatch);

    expect(mockGetDone).toBeCalled();
    expect(mockGetScheduledDate).toBeCalled();
    expect(mockGetExecutionDate).toBeCalled();

    expect(dispatch.mock.calls.length).toBe(3);
    expect(dispatch.mock.calls[0][0]).toEqual({
      type: 'proposals/REQUEST',
      payload: {}
    });
    expect(dispatch.mock.calls[1][0]).toEqual({
      type: 'proposals/SUCCESS',
      payload: expect.arrayContaining([
        expect.objectContaining({
          title: expect.any(String),
          proposal_blurb: expect.any(String),
          about: expect.any(String),
          source: expect.any(String),
          end_timestamp: expect.any(Number),
          date: expect.stringMatching(dateRegex),
          verified: expect.any(Boolean),
          topicKey: expect.any(String),
          active: expect.any(Boolean),
          govVote: expect.any(Boolean),
          submitted_by: {
            name: expect.any(String),
            link: expect.any(String)
          }
        })
      ])
    });
  }
);
