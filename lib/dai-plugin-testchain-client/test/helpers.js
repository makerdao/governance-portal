import Maker from '@makerdao/dai';
import testchainClientPlugin from '../src';
import governancePlugin from '@makerdao/dai-plugin-governance';

export async function setupTestMakerInstance(preset, settings) {
  const maker = Maker.create(preset, {
    plugins: [testchainClientPlugin, governancePlugin],
    log: false,
    ...settings
  });
  await maker.authenticate();
  return maker;
}
