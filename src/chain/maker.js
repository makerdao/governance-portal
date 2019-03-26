import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';
import configPlugin from '@makerdao/dai-plugin-config';

import { netToUri } from '../utils/ethereum';

export default async function createMaker(
  network = 'mainnet',
  useMcdKovanContracts,
  testchainConfigId
) {
  let addressOverrides;
  if (useMcdKovanContracts)
    addressOverrides = require('./addresses/kovan-mcd.json');

  const config = {
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      [governancePlugin, { network, addressOverrides }]
    ],
    autoAuthenticate: true,
    log: false,
    provider: {
      url: testchainConfigId ? '' : netToUri(network),
      type: 'HTTP'
    }
  };

  // Use the config plugin, if we have a testchainConfigId
  if (testchainConfigId) {
    delete config.provider;
    config.plugins.push([configPlugin, { testchainId: testchainConfigId }]);
  }

  return Maker.create('http', config);
}

export { ETH, MKR };
