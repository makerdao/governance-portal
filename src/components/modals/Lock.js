import React from 'react';
import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import { lock } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';
import MKRApprove from './MKRApprove';
import TransactionModal from './shared/InitiateTransaction';

import { StyledTop, StyledTitle, StyledBlurb } from './shared/styles';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance =
    account.proxyRole === 'hot'
      ? account.proxy.linkedAccount.mkrBalanceRaw
      : account.mkrBalanceRaw;
  return {
    balance,
    account,
    hasInfMkrApproval: account.proxy.hasInfMkrApproval,
    txHash: state.proxy.sendMkrTxHash,
    txStatus: state.proxy.sendMkrTxStatus
  };
};

const mapDispatchToProps = {
  lock,
  modalClose
};

const Lock = ({
  hasInfMkrApproval,
  txHash,
  txStatus,
  account,
  lock,
  balance,
  modalClose,
  ...props
}) => {
  if (!hasInfMkrApproval) return <MKRApprove {...props} />;

  return (
    <TransactionModal
      txPurpose="This transaction is to lock your MKR. Your funds are safe. You can withdraw them at anytime"
      txHash={txHash}
      txStatus={txStatus}
      account={account}
      onComplete={modalClose}
    >
      {onNext => {
        return (
          <React.Fragment>
            <StyledTop>
              <StyledTitle>Lock MKR</StyledTitle>
            </StyledTop>
            <StyledBlurb>
              Locking your MKR allows you to vote. The more you lock the more
              voting power you have. You can withdraw it at anytime
            </StyledBlurb>
            <AmountInput
              buttonLabel="Lock MKR"
              amountLabel="MKR balance"
              maxAmount={balance}
              skip={modalClose}
              onSubmit={amount => {
                lock(amount);
                onNext();
              }}
            />
          </React.Fragment>
        );
      }}
    </TransactionModal>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Lock);
