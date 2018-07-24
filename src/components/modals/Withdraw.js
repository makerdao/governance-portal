import { connect } from 'react-redux';
import { getActiveAccount } from '../../reducers/accounts';
import { withdrawMkr, clear as clearProxyState } from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';

const mapStateToProps = state => ({
  balance: getActiveAccount(state).proxy.votingPower,
  txHash: state.proxy.withdrawMkrTxHash,
  confirming: state.proxy.confirmingWithdrawMkr,
  network: state.metamask.network,
  title: 'Withdraw MKR',
  blurb:
    'Please select the amount of MKR to withdraw from the secure voting contract.',
  amountLabel: 'MKR in voting system',
  buttonLabel: 'Withdraw MKR'
});

const mapDispatchToProps = {
  action: withdrawMkr,
  modalClose,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmountInput);
