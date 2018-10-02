import BigNumber from 'bignumber.js';
import takeLast from 'ramda/src/takeLast';

BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: 1 });

export const WEI = 1;
export const GWEI = 1000000000;
export const ETHER = 1000000000000000000;
export const MAX_UINT = `0x${Array(64 + 1).join('f')}`;
export const MAX_UINT_ETH_BN = BigNumber(MAX_UINT).shiftedBy(-18);

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
export const padLeft = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc convert a padded bytes32 string to an ethereum address
 * @param  {String} hex
 * @return {String}
 */
export const paddedBytes32ToAddress = hex =>
  hex.length > 42 ? '0x' + takeLast(40, hex) : hex;

/**
 * @desc get ethereum contract call data string
 * @param  {Object} obj
 * @param  {String} obj.method
 * @param  {String[]} [obj.args]
 * @return {String}
 */
export const generateCallData = ({ method, args = [] }) => {
  let val = '';
  for (let i = 0; i < args.length; i++) val += padLeft(args[i], 64);
  const data = method + val;
  return data;
};

/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */
export const removeHexPrefix = hex => hex.toLowerCase().replace('0x', '');

/**
 * @desc convert hex to number string
 * @param  {String} hex
 * @return {String}
 */
export const hexToNumString = hex => BigNumber(`${hex}`).toFixed();

/**
 * @desc convert hex to number
 * @param  {String} address
 * @return {Number} seed
 */
export const numberForAddress = address => parseInt(address.slice(2, 10), 16);

/**
 * @desc convert number string from wei to ether
 * @param  {String} value
 * @return {String}
 */
export const weiToEther = value =>
  BigNumber(`${value}`)
    .div(ETHER)
    .toFixed();

/**
 * @desc convert number string from ether to wei
 * @param  {String} value
 * @return {String}
 */
export const etherToWei = value =>
  BigNumber(`${value}`)
    .times(ETHER)
    .toFixed();

/**
 * @desc get network name
 * @param  {Number|String} id
 * @return {String}
 */
export const netIdToName = id => {
  switch (parseInt(id, 10)) {
    case 1:
      return 'mainnet';
    case 42:
      return 'kovan';
    case 999:
      return 'ganache';
    default:
      return '';
  }
};

/**
 * @desc get network id
 * @param  {String} name
 * @return {Number}
 */
export const netNameToId = name => {
  switch (name) {
    case 'mainnet':
      return 1;
    case 'kovan':
      return 42;
    default:
      return '';
  }
};

/**
 * @desc given address is "zero" address
 * @param  {String} address
 * @return {Boolean}
 */
export const isZeroAddress = address => !BigNumber(address).toNumber();

/**
 * @desc number string to 0x prefixed hex
 * @param  {String} string
 * @return {String} 0x hex
 */
export const stringToHex = string => BigNumber(`${string}`).toFixed(16);

/**
 * @desc returns whether txString is a syntactically correct tx
 * @param  {String} txString
 * @return {Boolean}
 */
export const validTxString = txString => /^0x([A-Fa-f0-9]{64})$/.test(txString);

/**
 * @desc returns whether txString is a syntactically correct address
 * @param  {String} addressString
 * @return {Boolean}
 */
export const validAddressString = addressString =>
  /^0x([A-Fa-f0-9]{40})$/.test(addressString);

/**
 * @desc get etherescan address link
 * @param  {String} address
 * @param  {String} network
 * @return {String} link
 */
export const ethScanLink = (string, network = 'mainnet') => {
  const pathPrefix = network === 'mainnet' ? '' : `${network}.`;
  if (validAddressString(string))
    return `https://${pathPrefix}etherscan.io/address/${string}`;
  else if (validTxString(string))
    return `https://${pathPrefix}etherscan.io/tx/${string}`;
  // TODO maybe log to raven instead of throwing
  else throw new Error(`Can't create Etherscan link for "${string}"`);
};
