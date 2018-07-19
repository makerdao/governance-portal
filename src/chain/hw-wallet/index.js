import * as Web3ProviderEngine from 'web3-provider-engine/dist/es5';
import * as RpcSource from 'web3-provider-engine/dist/es5/subproviders/rpc';
import Transport from '@ledgerhq/hw-transport-u2f';
import LedgerSubProvider from './vendor/ledger-subprovider';
import TrezorSubProvider from './vendor/trezor-subprovider';

// deviceOptions: networkId, path, accountsLength, accountsOffset
export function createSubProvider(device, deviceOptions) {
  if (!['trezor', 'ledger'].includes(device)) {
    throw new Error(`Unrecognized device type: "${device}"`);
  }

  return device === 'ledger'
    ? LedgerSubProvider(Transport.create, deviceOptions)
    : TrezorSubProvider(deviceOptions);
}

export async function setHardwareWallet(web3, device, deviceOptions, rpcUrl) {
  web3.stop();
  web3.setProvider(new Web3ProviderEngine());
  web3.currentProvider.name = device;
  const wallet = createSubProvider(device, deviceOptions);
  web3.currentProvider.addProvider(wallet);
  // FIXME can we get the rpcUrl value from the existing settings?
  web3.currentProvider.addProvider(new RpcSource({ rpcUrl }));
  web3.currentProvider.start();
  web3.useLogs = false;

  return true;
}
