import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import {
  sendMkrToProxy,
  smartStepSkip,
  clear as clearProxyState
} from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance =
    account.proxyRole === 'hot'
      ? account.proxy.linkedAccount.mkrBalance
      : account.mkrBalance;
  return {
    balance,
    account,
    txHash: state.proxy.sendMkrTxHash,
    confirming: state.proxy.confirmingSendMkr,
    network: state.metamask.network,
    title: 'Lock MKR',
    blurb:
      'Locking your MKR allows you to vote. The more you lock the more voting power you have. You can withdraw it at anytime',
    amountLabel: 'MKR balance',
    buttonLabel: 'Lock MKR',
    txSent: !!state.proxy.sendMkrAmount
  };
};

const mapDispatchToProps = {
  action: sendMkrToProxy,
  modalClose,
  skip: smartStepSkip,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmountInput);
