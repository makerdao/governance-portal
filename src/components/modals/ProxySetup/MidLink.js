import React, { Fragment } from 'react';

import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Oblique,
  Bold
} from '../shared/styles';
import Button from '../../Button';

const MidLink = ({
  hotAddress,
  coldAddress,
  proxyClear,
  goToStep,
  nextStep
}) => (
  <Fragment>
    <StyledTop>
      <StyledTitle>You've initiated the following link</StyledTitle>
    </StyledTop>
    <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
      <Bold>Cold wallet:</Bold> <Oblique> {coldAddress} </Oblique>
      <br />
      <Bold>Hot wallet:</Bold> <Oblique> {hotAddress} </Oblique>
      <br />
      <div style={{ marginTop: '20px' }}>
        By clicking "approve", you may confirm that link
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
        Approve
      </Button>
    </div>
  </Fragment>
);

export default MidLink;
