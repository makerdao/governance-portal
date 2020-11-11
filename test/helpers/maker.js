import Maker from '@makerdao/dai';
import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
const ALCHEMY_KEY = 'Z8mVj3Mv-Ejd-S97690_uHhlg8nZmvHl';

export default async function instantiateMaker(network) {
  const url =
    network === 'testnet'
      ? process.env.TEST_RPC_URL
      : `https://eth-${network}.alchemyapi.io/v2/${ALCHEMY_KEY}`;

  // this is required here instead of being imported normally because it runs
  // code that will break if run server-side
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const config = {
    url,
    log: false,
    multicall: true,
    plugins: [trezorPlugin, ledgerPlugin, [governancePlugin, { network }]],
    autoAuthenticate: true
  };

  let maker = await Maker.create('http', config);
  window.maker = maker; // for debugging
  return maker;
}
