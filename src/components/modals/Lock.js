import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { getActiveAccount } from '../../reducers/accounts';
import {
  StyledTop,
  StyledTitle,
  StyledBlurb,
  StyledInput,
  InputLabels,
  ValueLabel,
  EndButton
} from './shared/styles';

const Lock = ({ balance }) => {
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Lock MKR</StyledTitle>
      </StyledTop>
      <StyledBlurb>
        Please select the amount of MKR to lock in the secure voting contract.
        You can withdraw it at any time.
      </StyledBlurb>
      <InputLabels>
        <div>Enter MKR amount</div>
        <div>
          <ValueLabel>MKR balance</ValueLabel> {balance} MKR
        </div>
      </InputLabels>
      <StyledInput type="text" />
      <EndButton>Lock MKR</EndButton>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  balance: getActiveAccount(state).mkrBalance
});

export default connect(mapStateToProps)(Lock);
