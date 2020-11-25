import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';
import configPlugin from '@makerdao/dai-plugin-config';
import { createCurrency } from '@makerdao/currency';

import { netToUri } from '../utils/ethereum';

export default async function createMaker(
  network = 'mainnet',
  useMcdKovanContracts,
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
        VOTE_PROXY_FACTORY: '0xEec40383cbeE179Be76D4D930c0ABD0D4beA672f'
      }
    };
  }

  if (useMcdKovanContracts) {
    const MKR = createCurrency('MKR');
    const IOU = createCurrency('IOU');
    const kovanMcdAddresses = require('./addresses/kovan-mcd.json');
    const addContracts = Object.keys(kovanMcdAddresses).reduce(
      (result, key) => {
        result[key] = { address: { kovan: kovanMcdAddresses[key] } };
        return result;
      },
      {}
    );

    const token = {
      erc20: [
        {
          currency: MKR,
          symbol: MKR.symbol,
          address: kovanMcdAddresses.GOV
        },
        {
          currency: IOU,
          symbol: IOU.symbol,
          address: kovanMcdAddresses.IOU
        }
      ]
    };

    config.smartContract = { addContracts };
    config.token = token;
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
