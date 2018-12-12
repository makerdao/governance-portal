import Maker from '@makerdao/dai';

export default class TestChainService extends Maker.LocalService {
  constructor(name = 'testchain') {
    super(name);
  }

  testServiceMethod(world) {
    return `hello ${world}`;
  }
}
