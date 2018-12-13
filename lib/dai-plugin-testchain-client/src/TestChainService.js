import Maker from '@makerdao/dai';
import fetchConfig from './fetchConfig';

export default class TestChainService extends Maker.LocalService {
  constructor(name = 'testchain') {
    super(name);
  }

  testServiceMethod(world) {
    return `hello ${world}`;
  }

  fetchConfigByTestchainId(testchainId) {
    return fetchConfig(testchainId);
  }

  async fetchAsyncThing() {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    return await res.json();
  }
}
