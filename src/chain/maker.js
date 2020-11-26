import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';
import configPlugin from '@makerdao/dai-plugin-config';

import { netToUri } from '../utils/ethereum';

export default async function createMaker(
  network = 'mainnet',
  testchainConfigId,
  backendEnv
) {
  const config = {
    plugins: [trezorPlugin, ledgerPlugin, [governancePlugin, { network }]],
    autoAuthenticate: true,
    log: false,
    provider: {
      url: testchainConfigId ? '' : netToUri(network),
      type: 'HTTP'
    }
  };

  // temporary overrides until chief v1.2 is deployed on mainnet.
  // can be removed when new plugins are released
  if (network === 'kovan') {
    config.smartContract = {
      addressOverrides: {
        CHIEF: '0x27E0c9567729Ea6e3241DE74B3dE499b7ddd3fe6',
        VOTE_PROXY_FACTORY: '0x1400798AA746457E467A1eb9b3F3f72C25314429'
      }
    };
  }

  // Use the config plugin, if we have a testchainConfigId
  if (testchainConfigId) {
    delete config.provider;
    config.plugins.push([
      configPlugin,
      { testchainId: testchainConfigId, backendEnv }
    ]);
  }

  return Maker.create('http', config);
}

export { ETH, MKR };
