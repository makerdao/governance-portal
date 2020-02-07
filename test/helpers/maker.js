import Maker from '@makerdao/dai';
import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
const INFURA_KEY = '6ba7a95268bf4ccda9bf1373fe582b43';

export default async function instantiateMaker(network) {
  const url =
    network === 'test'
      ? process.env.TEST_RPC_URL
      : `https://${network}.infura.io/v3/${INFURA_KEY}`;

  // this is required here instead of being imported normally because it runs
  // code that will break if run server-side
  const trezorPlugin = require('@makerdao/dai-plugin-trezor-web').default;

  const config = {
    url,
    log: false,
    multicall: true,
    plugins: [trezorPlugin, ledgerPlugin, governancePlugin],
    autoAuthenticate: true
  };

  let maker = await Maker.create('http', config);
  window.maker = maker; // for debugging
  return maker;
}
