import React, { useReducer } from 'react';
import { hot } from 'react-hot-loader/root';
import StepperUI from './StepperUI';
import StepperHeader from './StepperHeader';
import { ModalTest } from './modals/ModalTest';

const screens = [['A Test Stepper', props => <ModalTest {...props} />]];

const initialState = {
  step: 0
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'increment-step':
      return {
        ...state,
        step: state.step + ((payload && payload.by) || 1)
      };
    case 'decrement-step':
      return {
        ...state,
        step: state.step - ((payload && payload.by) || 1)
      };
    case 'reset':
      return { ...initialState };
    default:
      return state;
  }
}

function ModalTestStepper({ onClose }) {
  const [{ step }, dispatch] = useReducer(reducer, initialState);

  const screenProps = {
    dispatch,
    onClose
  };

  return (
    <StepperUI
      step={step}
      steps={screens.map(([title]) => title)}
      renderStepperHeader={() => <StepperHeader onClose={onClose} />}
    >
      {screens.map(([, getComponent], screenIndex) =>
        getComponent({ ...screenProps, screenIndex, key: screenIndex })
      )}
    </StepperUI>
  );
}

export default hot(ModalTestStepper);
