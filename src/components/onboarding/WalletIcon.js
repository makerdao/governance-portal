import React from 'react';

import metamaskImg from '../../imgs/metamask.svg';
import trezorImg from '../../imgs/onboarding/trezor-logomark.svg';
import ledgerImg from '../../imgs/onboarding/ledger-logomark.svg';

const WalletIcon = ({ provider, ...props }) => {
  let imgSrc = '';
  switch (provider) {
    case 'metamask':
      imgSrc = metamaskImg;
      break;
    case 'trezor':
      imgSrc = trezorImg;
      break;
    case 'ledger':
      imgSrc = ledgerImg;
      break;
  }
  return <img src={imgSrc} alt="" {...props} />;
};

export default WalletIcon;
