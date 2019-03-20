import React from 'react';
import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import { free } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';
import TransactionModal from './shared/InitiateTransaction';

import { StyledTop, StyledTitle, StyledBlurb } from './shared/styles';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance = account.proxy.votingPower;
  return {
    balance,
    account,
    txHash: state.proxy.withdrawMkrTxHash,
    txStatus: state.proxy.withdrawMkrTxStatus
  };
};

const mapDispatchToProps = {
  free,
  modalClose
};

const Withdraw = ({ account, txHash, txStatus, balance, modalClose, free }) => {
  return (
    <TransactionModal
      txPurpose="This transaction is to withdraw your MKR back to your cold wallet"
      account={account}
      txHash={txHash}
      txStatus={txStatus}
      onComplete={modalClose}
    >
      {onNext => {
        return (
          <React.Fragment>
            <StyledTop>
              <StyledTitle>Withdraw MKR</StyledTitle>
            </StyledTop>
            {/* TODO check verbiage from the blurb for singlewallet voting */}
            <StyledBlurb>
              Please select the amount of MKR to withdraw from the voting
              contract. This will be sent back to the designated cold wallet.
            </StyledBlurb>
            <AmountInput
              buttonLabel="Withdraw MKR"
              amountLabel="MKR in voting system"
              maxAmount={balance}
              onCancel={modalClose}
              onSubmit={amount => {
                free(amount);
                onNext();
              }}
            />
          </React.Fragment>
        );
      }}
    </TransactionModal>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Withdraw);
