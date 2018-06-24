import BigNumber from "bignumber.js";
import units from "../contracts/units.json";

/**
 * @desc pad string to specific width and padding
 * @param  {String} n
 * @param  {Number} width
 * @param  {String} z
 * @return {String}
 */
export const padLeft = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * @desc get ethereum contract call data string
 * @param  {String} method
 * @param  {Array}  args
 * @return {String}
 */
export const generateCallData = ({ method, args }) => {
  let val = "";
  for (let i = 0; i < args.length; i++) val += padLeft(args[i], 64);
  const data = method + val;
  return data;
};

/**
 * @desc remove hex prefix
 * @param  {String} hex
 * @return {String}
 */
export const removeHexPrefix = hex => hex.toLowerCase().replace("0x", "");

/**
 * @desc convert hex to number string
 * @param  {String} hex
 * @return {String}
 */
export const hexToNumString = hex => BigNumber(`${hex}`).toString();

/**
 * @desc convert number string from WAD to ether
 * @param  {String} value
 * @return {String}
 */
export const weiToEther = value =>
  BigNumber(`${value}`)
    .div(units.ether)
    .toString();
