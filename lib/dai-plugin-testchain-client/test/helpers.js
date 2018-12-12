import Maker from '@makerdao/dai';
import TestchainClientPlugin from '../src';

export async function setupTestMakerInstance(settings) {
  const maker = Maker.create('test', {
    plugins: [TestchainClientPlugin],
    log: false,
    ...settings
  });
  await maker.authenticate();
  return maker;
}
