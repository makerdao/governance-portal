import * as Web3ProviderEngine from 'web3-provider-engine/dist/es5';
import * as RpcSource from 'web3-provider-engine/dist/es5/subproviders/rpc';
import Transport from '@ledgerhq/hw-transport-u2f';
import LedgerSubProvider from './vendor/ledger-subprovider';
import TrezorSubProvider from './vendor/trezor-subprovider';

export const TREZOR = 'TREZOR';
export const LEDGER = 'LEDGER';

export async function useTrezor(web3, deviceOptions, rpcUrl) {
  return useHardwareWallet(web3, TREZOR, deviceOptions, rpcUrl);
}

export async function useLedger(web3, deviceOptions, rpcUrl) {
  return useHardwareWallet(web3, LEDGER, deviceOptions, rpcUrl);
}

export async function useHardwareWallet(web3, device, deviceOptions, rpcUrl) {
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

// deviceOptions: networkId, path, accountsLength, accountsOffset
export function createSubProvider(device, deviceOptions) {
  if (![TREZOR, LEDGER].includes(device)) {
    throw new Error(`Unrecognized device type: "${device}"`);
  }

  return device === LEDGER
    ? LedgerSubProvider(() => Transport.create(), deviceOptions)
    : TrezorSubProvider(deviceOptions);
}
