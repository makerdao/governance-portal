import {
  url,
  provider,
  privateKey,
  accounts,
  addContracts
} from './utils/configHelper';

export default async testchainId => {
  return configHelper(testchainId);
};

const configHelper = testchainId => {
  switch (testchainId) {
    case 1:
      return mainnetConfig;
    case 2:
      return taasConfig;
    case 42:
      return kovanConfig;
    case 999:
      return ganacheConfig;
    default:
      break;
  }
};
const taasConfig = {
  url: url.taas,
  privateKey: privateKey.ganache,
  accounts: accounts.ganache,
  provider: provider.ganache,
  smartContract: addContracts
};

const mainnetConfig = {
  url: url.mainnet,
  privateKey: privateKey.mainnet,
  accounts: accounts.mainnet,
  provider: provider.mainnet,
  smartContract: addContracts
};

const ganacheConfig = {
  url: url.ganache,
  privateKey: privateKey.ganache,
  accounts: accounts.ganache,
  provider: provider.ganache,
  smartContract: addContracts
};

const kovanConfig = {
  url: url.kovan,
  privateKey: privateKey.kovan,
  accounts: accounts.kovan,
  provider: provider.kovan,
  smartContract: addContracts
};
