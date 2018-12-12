import TestChainService from './TestChainService';

export default {
  addConfig: () => ({
    additionalServices: ['testchain'],
    testchain: TestChainService
  })
};
