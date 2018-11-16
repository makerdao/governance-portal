import React from 'react';
import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts/actions';
import {
  lock as proxyLock,
  smartStepSkip,
  clear as clearProxyState
} from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';
import MKRApprove from './MKRApprove';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance =
    account.proxyRole === 'hot'
      ? account.proxy.linkedAccount.mkrBalance
      : account.mkrBalance;
  return {
    balance,
    account,
    hasInfMkrApproval: account.proxy.hasInfMkrApproval,
    txHash: state.proxy.sendMkrTxHash,
    confirming: state.proxy.confirmingSendMkr,
    network: state.metamask.network,
    title: 'Lock MKR',
    blurb:
      'Locking your MKR allows you to vote. The more you lock the more voting power you have. You can withdraw it at anytime',
    txPurpose:
      'This transaction is to lock your MKR. Your funds are safe. You can withdrawn them at anytime',
    amountLabel: 'MKR balance',
    buttonLabel: 'Lock MKR',
    txSent: !!state.proxy.sendMkrAmount
  };
};

const mapDispatchToProps = {
  action: proxyLock,
  maxAction: proxyLock,
  modalClose,
  skip: smartStepSkip,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(({ hasInfMkrApproval, ...props }) => {
  if (hasInfMkrApproval) return <AmountInput {...props} />;
  else return <MKRApprove {...props} />;
});
