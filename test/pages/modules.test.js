import React from 'react';
import Modules from '../../src/pages/Modules';
import instantiateMaker from '../helpers/maker';
import { MKR } from '@makerdao/dai';
import {
  act,
  cleanup,
  fireEvent,
  render,
  wait,
  waitForElement
} from '@testing-library/react';
import 'jest-styled-components';

const { click } = fireEvent;

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let store, maker;

beforeAll(async () => {
  maker = await instantiateMaker('testnet');
});

afterEach(cleanup);

describe('renders summary page', () => {
  let accounts, esm;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    jest.setTimeout(20000);
    await wait(() => window.maker);
    esm = {
      cageTime: 0,
      totalStaked: MKR(0.00042),
      thresholdAmount: 50000,
      fired: false,
      canFire: false
    };
    accounts = {
      activeAccount: maker.currentAddress(),
      allAccounts: [
        {
          address: maker.currentAddress(),
          type: 'browser',
          mkrInEsm: MKR(0),
          mkrBalance: '2.0000',
          hasProxy: false,
          proxyRole: '',
          votingFor: [],
          hasInfMkrApproval: false,
          hasInfIouApproval: false,
          proxy: {
            address: '',
            votingPower: 1,
            hasInfIouApproval: false,
            hasInfMkrApproval: false,
            linkedAccount: {}
          },
          mkrLockedChiefHot: 0,
          mkrLockedChiefCold: 0
        }
      ]
    };
    store = mockStore({ accounts, esm });
  });

  test('renders with state', async () => {
    let { container } = await render(<Modules store={store} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('show progress bar', async () => {
    const { getByTestId } = await render(<Modules store={store} />);
    getByTestId('progress-bar');
  });

  test('show esm history', async () => {
    const { getByText } = await render(<Modules store={store} />);
    getByText('ESM History');
    await wait(() => getByText('Dec 5, 2019'));
  });

  test('show "Burn your MKR" button', async () => {
    const { getByText } = await render(<Modules store={store} />);
    getByText('Burn your MKR');
  });

  test('show Initiate Shutdown button on threshold reached', async () => {
    let newESM = Object.assign(
      {},
      { ...esm, canFire: true, totalStaked: MKR(50000), thresholdAmount: 50000 }
    );
    let subStore = mockStore({ accounts, esm: newESM });
    const { getByText } = await render(<Modules store={subStore} />);
    await wait(() => getByText('Initiate Emergency Shutdown'));
  });

  test('show disabled Initiate Shutdown button on shutdown initiated', async () => {
    let newESM = Object.assign(
      {},
      {
        ...esm,
        canFire: false,
        totalStaked: MKR(50000),
        thresholdAmount: 50000,
        // hack to allow for bigNumber
        cageTime: MKR(1580326770128)
      }
    );
    let subStore = mockStore({ accounts, esm: newESM });
    const { getByText, getByTestId, debug } = await render(
      <Modules store={subStore} />
    );
    const initiateButton = getByText('Initiate Emergency Shutdown');
    expect(initiateButton.disabled).toBeTruthy();
    await wait(() => getByTestId('shutdown-initiated'));
  });

  test('Burn MKR Modal Flow', async () => {
    const { getByTestId, getAllByTestId, getByText, getByRole } = await render(
      <Modules store={store} />
    );

    // Intro Render
    await wait(() =>
      getByText('The Emergency Shutdown Module (ESM) is responsible for', {
        exact: false
      })
    );
    click(getByText('Continue'));

    // First Step Render
    click(getByText('Burn your MKR'));
    await wait(() => getByText('Are you sure you want to burn MKR?'));
    click(getByText('Continue'));

    // Second Step Render
    await wait(() => getByText('Burn your MKR in the ESM'));

    // Not Enough MKR Check
    const amount = 3;
    fireEvent.change(getByRole('textbox'), { target: { value: amount } });
    await wait(() => getByText("You don't have enough MKR"));
    const continueButton = getByText('Continue');
    expect(continueButton.disabled).toBeTruthy();

    // Set Max Check
    click(getByText('Set max'));
    expect(getByRole('textbox').value).toEqual('2.0000');

    // MKR is Chief Check
    getByTestId('voting-power');

    // Valid Amount Check
    fireEvent.change(getByRole('textbox'), { target: { value: amount - 2 } });
    expect(continueButton.disabled).toBeFalsy();
    click(continueButton);

    // Third Step Render
    await wait(() => getByText('Burn amount'));
    await wait(() => getByText('New ESM total'));
    let confirmInput;
    act(() => {
      confirmInput = getAllByTestId('confirm-input')[2];
    });
    let burnMKRbutton;
    act(() => {
      burnMKRbutton = getByText('Burn MKR');
    });
    expect(burnMKRbutton.disabled).toBeTruthy();

    // click the terms of service
    const tos = getByTestId('tosCheck');
    click(tos);
    expect(tos.checked).toBeTruthy();

    // click the unlock mkr
    const allowanceBtn = getByTestId('allowance-toggle').children[0];
    await waitForElement(() => !allowanceBtn.disabled);
    click(allowanceBtn);
    await waitForElement(() => allowanceBtn.disabled);

    // Incorrect Input Check
    fireEvent.change(confirmInput, { target: { value: 'I am burning 2 MKR' } });
    expect(burnMKRbutton.disabled).toBeTruthy();

    // Correct Input Check
    fireEvent.change(confirmInput, { target: { value: 'I am burning 1 MKR' } });
    const step2 = await waitForElement(() => getByTestId('step2'));

    await waitForElement(() => !burnMKRbutton.disabled);
    click(burnMKRbutton);

    // Third Step Render
    await wait(() => getByText('Your MKR is being burned'));

    // Fourth Step Success Render
    await wait(() => getByText('MKR Burned'));
  });
});
