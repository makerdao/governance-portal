import Maker from '@makerdao/dai';
import testchainClientPlugin from '../src';
import governancePlugin from '@makerdao/dai-plugin-governance';
// import { intersection, isEqual, mergeWith } from 'lodash';

export async function setupTestMakerInstance(preset, settings) {
  const testchainId = 1;
  const testchainConfig = await testchainClientPlugin(testchainId);

  const makerConfig = {
    ...testchainConfig,
    plugins: [governancePlugin],
    log: false,
    ...settings
  };
  // const config = Object.assign(testchainConfig, makerConfig);
  // console.log('conf', conf);
  console.log('makerConfig', makerConfig);
  // console.log('config to send to maker.create', config);

  const maker = await Maker.create(preset, makerConfig);
  await maker.authenticate();
  return maker;
}
