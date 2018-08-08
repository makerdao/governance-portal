import React, { Fragment } from 'react';

import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import Button from '../../Button';

const Resume = ({
  hotAddress,
  coldAddress,
  proxyClear,
  goToStep,
  nextStep
}) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>Link request detected</StyledTitle>
    </StyledTop>
    <StyledBlurb style={{ textAlign: 'center' }}>
      You've initiated the following link:<br />
      <br />
      <strong style={{ fontWeight: 500 }}>Cold wallet:</strong>{' '}
      <strong style={{ fontStyle: 'oblique' }}> {coldAddress} </strong>
      <br />
      <strong style={{ fontWeight: 500 }}>Hot wallet:</strong>{' '}
      <strong style={{ fontStyle: 'oblique' }}> {hotAddress} </strong>
      <br />
      <div style={{ marginTop: '20px' }}>
        By clicking "continue", you may approve that link if your hot wallet is
        active.
      </div>
    </StyledBlurb>
    <div
      style={{
        display: 'flex',
        marginTop: '20px',
        justifyContent: 'space-between'
      }}
    >
      <Button
        slim
        onClick={() => {
          localStorage.clear();
          goToStep('intro');
          proxyClear();
        }}
      >
        Start over
      </Button>
      <Button
        slim
        onClick={() => {
          nextStep();
        }}
      >
        Continue
      </Button>
    </div>
  </Fragment>
);

export default Resume;
