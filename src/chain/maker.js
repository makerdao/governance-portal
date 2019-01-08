import governancePlugin from '@makerdao/dai-plugin-governance';
import trezorPlugin from '@makerdao/dai-plugin-trezor-web';
import ledgerPlugin from '@makerdao/dai-plugin-ledger-web';
import Maker, { ETH, MKR } from '@makerdao/dai';
// import testchainClientPlugin from '@makerdao/dai-plugin-testchain';
import configPlugin from '@makerdao/dai-plugin-config';

export default async function createMaker(network = 'mainnet', testchainId) {
  let gasPrice = 6 * 10 ** 9; // default to 6 Gwei gas price
  try {
    // check ethgasstation for gas price info
    const res = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
    const gasData = await res.json();
    gasPrice = gasData.average * 10 ** 8;
    gasPrice = gasPrice + 3 * 10 ** 9; // 3 Gwei buffer
  } catch (err) {
    console.error(
      `Gas price fetch failed. Defaulting to ${gasPrice / 10 ** 9} Gwei.`
    );
  }

  // let testChainConfig = {};
  // if (testchainId) {
  //   testChainConfig = testchainClientPlugin(testchainId);
  //   console.log('Gov Dashbaord testchainconfig', testChainConfig);
  // }

  // const makerConfig = {
  //   plugins: [trezorPlugin, ledgerPlugin, governancePlugin],
  //   autoAuthenticate: true,
  //   log: false,
  // web3: {
  //   transactionSettings: {
  //     gasPrice
  //   }
  // },
  //   provider: {
  //     url: `https://${network}.infura.io/`,
  //     type: 'HTTP'
  //   }
  // };

  return Maker.create('http', {
    plugins: [
      trezorPlugin,
      ledgerPlugin,
      governancePlugin,
      // configPlugin,
      [configPlugin, { testchainId }]
    ],
    autoAuthenticate: true,
    log: false,
    web3: {
      transactionSettings: {
        gasPrice
      }
    },
    testchainId
  });
}

export { ETH, MKR };
