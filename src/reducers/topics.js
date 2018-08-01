/////////////////////////////////////////////////
//// Mocked backend w/ the current proposals ////
/////////////////////////////////////////////////

import { createReducer } from '../utils/redux';
import { initApprovalsFetch } from './approvals';
import mocked from '../_mock/topics';
import { getEtchedSlates } from '../chain/read';

// Constants ----------------------------------------------

const TOPICS_SUCCESS = 'toics/TOPICS_SUCCESS';

// Actions ------------------------------------------------

export const topicsInit = network => async dispatch => {
  if (network === 'ganache') {
    // look up all slates
    const slates = await getEtchedSlates();
    const topics = [
      {
        topic: 'Test topic',
        proposals: slates.map(source => ({
          title: 'Test proposal',
          source
        }))
      }
    ];
    dispatch({ type: TOPICS_SUCCESS, payload: topics });
  } else {
    dispatch({ type: TOPICS_SUCCESS, payload: mockedBackend[network] });
  }
  dispatch(initApprovalsFetch());
};

// Reducer ------------------------------------------------

const mockedBackend = mocked;

const topics = createReducer([], {
  [TOPICS_SUCCESS]: (_, { payload }) => payload
});

export default topics;
