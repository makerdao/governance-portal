import TestChainService from './TestChainService';

export default {
  addConfig: config => ({
    ...config,
    additionalServices: ['testchain'],
    testchain: TestChainService
  })
};
