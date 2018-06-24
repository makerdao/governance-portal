import Web3 from "web3";

export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(`https://mainnet.infura.io/`)
);

/**
 * @desc set a different web3 provider
 * @param {String}
 */
export const web3SetHttpProvider = provider => {
  let providerObj = null;
  if (provider.match(/(https?:\/\/)(\w+.)+/g)) {
    providerObj = new Web3.providers.HttpProvider(provider);
  }
  if (!providerObj) {
    throw new Error(
      "function web3SetHttpProvider requires provider to match a valid HTTP/HTTPS endpoint"
    );
  }
  return web3Instance.setProvider(providerObj);
};
