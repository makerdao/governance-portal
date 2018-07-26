import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import { sendMkrToProxy, clear as clearProxyState } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance = account.mkrBalance;
  return {
    balance,
    account,
    txHash: state.proxy.sendMkrTxHash,
    confirming: state.proxy.confirmingSendMkr,
    network: state.metamask.network,
    title: 'Lock MKR',
    blurb:
      'Please select the amount of MKR to lock in the secure voting contract. You can withdraw it at any time.',
    amountLabel: 'MKR balance',
    buttonLabel: 'Lock MKR',
    txSent: !!state.proxy.sendMkrAmount
  };
};

const mapDispatchToProps = {
  action: sendMkrToProxy,
  modalClose,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmountInput);
