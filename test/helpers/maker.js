import Maker from '@makerdao/dai';
import governancePlugin from '@makerdao/dai-plugin-governance';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import { netToUri } from '../../src/utils/ethereum';

export default async function instantiateMaker(network) {
  const url =
    network === 'testnet' ? process.env.TEST_RPC_URL : netToUri(network);

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
