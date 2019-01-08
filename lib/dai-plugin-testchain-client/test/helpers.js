import Maker from '@makerdao/dai';
import testchainClientPlugin from '../src';
import governancePlugin from '@makerdao/dai-plugin-governance';

export async function setupTestMakerInstance() {
  // const testnet = 'test';
  // const kovan = 'kovan';
  // const http = 'http';

  // mock url query param
  const testchainId = 42;
  // const testchainId = 999;

  const makerConfig = {
    plugins: [governancePlugin, testchainClientPlugin],
    log: false,
    testchainId
  };

  // console.log('makerConfig', makerConfig);

  const maker = await Maker.create('http', makerConfig);
  await maker.authenticate();
  return maker;
}
