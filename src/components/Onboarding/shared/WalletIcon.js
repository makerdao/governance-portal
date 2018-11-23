import React from 'react';

import { AccountTypes } from '../../../utils/constants';

import metamaskImg from '../../../imgs/metamask.svg';
import trezorImg from '../../../imgs/onboarding/trezor-logomark.svg';
import ledgerImg from '../../../imgs/onboarding/ledger-logomark.svg';

const WalletIcon = ({ provider, ...props }) => {
  let imgSrc = '';
  switch (provider) {
    case 'metamask':
    case AccountTypes.METAMASK:
      imgSrc = metamaskImg;
      break;
    case AccountTypes.TREZOR:
      imgSrc = trezorImg;
      break;
    case AccountTypes.LEDGER:
      imgSrc = ledgerImg;
      break;
    default:
      break;
  }
  return <img src={imgSrc} alt="" {...props} />;
};

export default WalletIcon;
