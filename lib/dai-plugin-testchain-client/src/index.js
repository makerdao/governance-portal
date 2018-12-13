import TestChainService from './TestChainService';

const nonAsyncFunc = input => {
  return 'Hello ' + input;
};

export default {
  addConfig: () => ({
    additionalServices: ['testchain'],
    testchain: TestChainService,
    nonAsyncFunc: nonAsyncFunc
  })
};
