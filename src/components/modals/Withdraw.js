import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts';
import {
  withdrawMkr,
  smartStepSkip,
  clear as clearProxyState
} from '../../reducers/proxy';
import { modalClose } from '../../reducers/modal';
import AmountInput from './shared/AmountInput';

const mapStateToProps = state => {
  const account = getActiveAccount(state);
  const balance = account.proxy.votingPower;
  return {
    balance,
    account,
    txHash: state.proxy.withdrawMkrTxHash,
    confirming: state.proxy.confirmingWithdrawMkr,
    network: state.metamask.network,
    title: 'Withdraw MKR',
    blurb:
      'Please select the amount of MKR to withdraw from the voting contract.',
    amountLabel: 'MKR in voting system',
    buttonLabel: 'Withdraw MKR',
    txSent: !!state.proxy.withdrawMkrAmount
  };
};

const mapDispatchToProps = {
  action: withdrawMkr,
  modalClose,
  skip: smartStepSkip,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmountInput);
