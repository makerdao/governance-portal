import React, { Fragment } from 'react';
import {
  StyledTitle,
  StyledBlurb,
  StyledTop,
  Oblique,
  Bold
} from './shared/styles';
import Button from '../Button';
import { connect } from 'react-redux';
import { breakLink } from '../../reducers/proxy';
import Transaction from './shared/Transaction';
import { modalClose } from '../../reducers/modal';
import Withdraw from './Withdraw';
import { modalOpen } from '../../reducers/modal';
import {
  getActiveAccount,
  setActiveAccount,
  getHardwareAccount
} from '../../reducers/accounts';
import { LEDGER } from '../../chain/hw-wallet';
import AppEth from '@ledgerhq/hw-app-eth';
import AddressGenerator from '../../chain/hw-wallet/vendor/address-generator';
import { obtainPathComponentsFromDerivationPath } from '../../chain/hw-wallet/vendor/ledger-subprovider';
import Transport from '@ledgerhq/hw-transport-u2f';

let globalAddresses = null;

async function getAddresses(path) {
  const askConfirm = false;
  const numAccounts = 10;
  const transport = await Transport.create();
  const eth = new AppEth(transport);
  const addresses = [];
  const pathComponents = obtainPathComponentsFromDerivationPath(path);
  const addr = await eth.getAddress(pathComponents.basePath, askConfirm, true);
  const addressGenerator = await new AddressGenerator(addr);
  for (let i = 0; i < numAccounts; i++) {
    const address = addressGenerator.getAddressString(i);
    addresses.push(address);
  }
  console.log('addresses: ', addresses);
  return addresses;
}

const AddressSelection = ({ getHardwareAccount, modalClose, addresses }) => {
  const legacyPath = "44'/60'/0'/0/0";
  const ledgerLivePath = "44'/60'/0'/0";
  const accountsOffset = 0;
  return (
    <Fragment>
      <StyledTop>
        <StyledTitle>Select Ledger Address</StyledTitle>
      </StyledTop>
      <StyledBlurb style={{ textAlign: 'center', marginTop: '30px' }}>
        addresses: {addresses.toString()}
      </StyledBlurb>
      <div
        style={{
          display: 'flex',
          marginTop: '20px',
          justifyContent: 'flex-end'
        }}
      >
        <Button
          slim
          onClick={() => {
            getHardwareAccount(LEDGER, {
              path: legacyPath,
              accountsOffset: accountsOffset
            });
            modalClose();
          }}
        >
          Select
        </Button>
      </div>
    </Fragment>
  );
};

const mapStateToProps = state => ({
  addresses: globalAddresses
});

export default connect(
  mapStateToProps,
  { getHardwareAccount, modalClose }
)(AddressSelection);
