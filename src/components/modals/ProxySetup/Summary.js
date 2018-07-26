import React, { Fragment } from 'react';
import { StyledTitle, StyledBlurb, StyledTop } from '../shared/styles';
import Button from '../../Button';

export default ({ modalClose, proxyClear, sendMkrAmount }) => {
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Secure voting contract setup</StyledTitle>
      </StyledTop>
      <StyledBlurb>
        Your secure voting contract has been successfully set up. You can now
        voting using your hot wallet below. You can manage your secure voting
        contract by clicking Secure voting on the governance dashboard
      </StyledBlurb>
      <div style={{ textAlign: 'center' }}>
        Locked in voting contract: {sendMkrAmount} MKR
      </div>
      <div
        style={{
          alignSelf: 'center',
          marginTop: '18px'
        }}
      >
        <Button
          slim
          onClick={() => {
            modalClose();
            // temp measure to update proxy status
            window.location.reload();
          }}
        >
          Finish and close
        </Button>
      </div>
    </Fragment>
  );
};
