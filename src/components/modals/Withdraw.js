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

const Withdraw = ({ balance }) => {
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Withdraw MKR</StyledTitle>
      </StyledTop>
      <StyledBlurb>
        Please select the amount of MKR to withdraw from the secure voting
        contract.
      </StyledBlurb>
      <InputLabels>
        <div>Enter MKR amount</div>
        <div>
          <ValueLabel>MKR in voting system</ValueLabel> {balance} MKR
        </div>
      </InputLabels>
      <StyledInput type="text" />
      <EndButton>Withdraw MKR</EndButton>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  balance: getActiveAccount(state).proxy.votingPower
});

export default connect(mapStateToProps)(Withdraw);
