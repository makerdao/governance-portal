import React from 'react';
import styled from 'styled-components';

const Step = styled.div`
  opacity: 0;
  position: absolute;
  pointer-events: none;

  ${props =>
    props.active &&
    `
    pointer-events: unset;
    position: relative;
    transition: opacity 0.6s;
    opacity: 1;
  `};
`;

const Stepper = ({ step, children }) => {
  return (
    <React.Fragment>
      {React.Children.map(children, (child, index) => {
        return <Step active={step === index}>{child}</Step>;
      })}
    </React.Fragment>
  );
};

export default Stepper;
