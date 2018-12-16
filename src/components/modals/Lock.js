import React from 'react';
import { connect } from 'react-redux';

import { getActiveAccount, getAccount } from '../../reducers/accounts';
import {
  lock as proxyLock,
  smartStepSkip,
  clear as clearProxyState
} from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';
import MKRApprove from './MKRApprove';

const mapStateToProps = state => {
  const activeAccount = getActiveAccount(state);
  let linkedAccount;
  let account;
  if (activeAccount.proxy.linkedAccount.address) {
    //if we can get cold address from account store, do that
    linkedAccount = getAccount(
      state,
      activeAccount.proxy.linkedAccount.address
    );
    account = activeAccount.proxyRole === 'hot' ? linkedAccount : activeAccount;
  } else {
    //if cold account not in account store, get it from the proxy store.  Only should happen if ADD_ACCOUNT calls from refreshAccountDataLink() after approve link is really slow
    account = getAccount(state, state.proxy.coldAddress);
  }
  const balance =
    activeAccount.proxyRole === 'hot'
      ? activeAccount.proxy.linkedAccount.mkrBalance
      : activeAccount.mkrBalance;
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
      'This transaction is to lock your MKR. Your funds are safe. You can withdraw them at anytime.',
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
