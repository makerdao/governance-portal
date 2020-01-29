import React from 'react';
import { Provider } from 'react-redux';
import Modules from '../../src/pages/Modules';
import { render } from '@testing-library/react';
import { takeSnapshot, restoreSnapshot } from '@makerdao/test-helpers';
import instantiateMaker from '../helpers/maker';
import Maker, { ETH, MKR } from '@makerdao/dai';
import {
  act,
  cleanup,
  fireEvent,
  wait,
  waitForElement
} from '@testing-library/react';
import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
const { click } = fireEvent;

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store, maker;

beforeAll(async () => {
  maker = await instantiateMaker('test');
});

afterEach(cleanup);

describe('renders summary page', () => {
  let renderedComponent;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    jest.setTimeout(20000);
    await wait(() => window.maker);
    store = mockStore({
      accounts: {
        activeAccount: maker.currentAddress(),
        allAccounts: [
          {
            address: maker.currentAddress(),
            type: 'browser',
            mkrInEsm: MKR(0),
            mkrBalance: '0.0000',
            hasProxy: false,
            proxyRole: '',
            votingFor: [],
            hasInfMkrApproval: false,
            hasInfIouApproval: false,
            proxy: {
              address: '',
              votingPower: 0,
              hasInfIouApproval: false,
              hasInfMkrApproval: false,
              linkedAccount: {}
            },
            mkrLockedChiefHot: 0,
            mkrLockedChiefCold: 0
          }
        ]
      },
      esm: {
        cageTime: 0,
        totalStaked: MKR(1),
        thresholdAmount: 50000,
        fired: false,
        canFire: false
      }
    });
  });

  test('renders with state', async () => {
    let renderedComponent = await render(<Modules store={store} />);
    expect(renderedComponent).toMatchSnapshot();
  });

  test('show progress bar', async () => {
    const { getByTestId } = await render(<Modules store={store} />);
    getByTestId('progress-bar');
  });

  test('show esm history', async () => {
    const { getByText } = await render(<Modules store={store} />);
    getByText('ESM History');
  });

  test('show "Burn your MKR" button', async () => {
    const { getByText } = await render(<Modules store={store} />);
    getByText('Burn your MKR');
  });
});
