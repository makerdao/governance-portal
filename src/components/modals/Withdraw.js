import { connect } from 'react-redux';

import { getActiveAccount } from '../../reducers/accounts/actions';
import {
  free as proxyFree,
  smartStepSkip,
  clear as clearProxyState,
  freeAll as proxyFreeAll
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
    txPurpose:
      'This transaction is to withdraw your MKR back to your cold wallet',
    blurb:
      'Please select the amount of MKR to withdraw from the voting contract. This will be sent back to the designated cold wallet.',
    amountLabel: 'MKR in voting system',
    buttonLabel: 'Withdraw MKR',
    txSent: !!state.proxy.withdrawMkrAmount
  };
};

const mapDispatchToProps = {
  action: proxyFree,
  maxAction: proxyFreeAll,
  modalClose,
  skip: smartStepSkip,
  clearProxyState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AmountInput);
