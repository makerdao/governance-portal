import takeLast from 'ramda/src/takeLast';
import take from 'ramda/src/take';
import BigNumber from 'bignumber.js';
import round from 'lodash.round';

BigNumber.config({ DECIMAL_PLACES: 18, ROUNDING_MODE: 1 });

/**
 * @desc returns whether current device is mobile
 * @return {Boolean}
 */
export const isMobile = () => {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  return mobileRegex.test(navigator.userAgent) || window.innerWidth < 450;
};

/**
 * @desc returns truncated string with middle replaced with elipse
 * @param {String} text
 * @param {Number} left - how many characters to keep from the beginning
 * @param {Number} right - how many characters to keep from the end
 * @return {String}
 */
export const cutMiddle = (text = '', left = 4, right = 4) => {
  if (text.length <= left + right) return text;
  return `${take(left, text).trim()}...${takeLast(right, text)}`;
};

/**
 * @desc returns a url slugged version of some text
 * @param {String} text eg "New Topic"
 * @return {String} eg "new-topic"
 */
export const toSlug = text =>
  text
    .split(' ')
    .map(word => word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase())
    .join('-');

/**
 * @desc if the number is bigger than 1000, truncate and add a "k"
 * @param {Number|String} n number
 * @return {String}
 */
export const kFormat = n => {
  const num = parseFloat(n);
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toFixed(2);
};

/**
 * @desc return a promise that resolves after specified time
 * @param {Number} time
 * @return {Promise}
 */
export const promiseWait = time =>
  new Promise(resolve => setTimeout(resolve, time || 0));

/**
 * @desc retry an async function a set number of times
 * @param  {Object} { times, fn, delay }
 * @return {Promise}
 */
export const promiseRetry = ({ times, fn, delay, args = [] }) => {
  return fn(...args).catch(
    err =>
      times > 0
        ? promiseWait(delay).then(() =>
            promiseRetry({ times: times - 1, fn, delay, args })
          )
        : Promise.reject(err)
  );
};

/**
 * @desc format date string to this app's standard display formate
 * @param  {String} dateString any parsable date string
 * @return {String} a date string like: shortMonthName dayNum, year
 */
export const formatDate = dateString => {
  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * @desc capitalize the first letter and lowercase the rest
 * @param  {String}
 * @return {String}
 */
export const firstLetterCapital = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLocaleLowerCase();

/**
 * @desc safe arithmetic
 * @param  {Number|String} a
 * @param  {Number|String} b
 * @return {String}
 */
export const add = (a, b) =>
  BigNumber(a)
    .plus(BigNumber(b))
    .toFixed();

export const subtract = (a, b) =>
  BigNumber(a)
    .minus(BigNumber(b))
    .toFixed();

export const mul = (a, b) =>
  BigNumber(a)
    .times(BigNumber(b))
    .toFixed();

export const div = (a, b) =>
  BigNumber(a)
    .dividedBy(BigNumber(b))
    .toFixed();

/**
 * @desc make error messages more understandable
 * @param  {String} errorMsg
 * @return {String}
 */
export const cleanErrorMsg = errorMsg => {
  if (errorMsg.search('Error: ') === 0) {
    if (errorMsg.search('Transaction gas is too low') > -1)
      return 'Transaction gas is too low';
    return errorMsg.replace('Error: ', '');
  }
  if (
    errorMsg.search('Insufficient funds') > -1 ||
    errorMsg.search('insufficient funds') > -1
  )
    return 'The account you tried to send a transaction from does not have enough ETH to pay for gas';
  if (errorMsg.search('transport') > -1) return 'Ledger connect failed';
  return errorMsg;
};

/**
 * @desc find the error message
 * @param  {String||Object} error
 * @return {String}
 */
export const parseError = error => {
  if (typeof error === 'string') {
    return cleanErrorMsg(error);
  } else if (typeof error.message === 'string') {
    return cleanErrorMsg(error.message);
  }
};

/**
 * @desc compare two strings w/o worrying about case
 * @param  {String} a
 * @param  {String} b
 * @return {Boolean}
 */
export const eq = (a, b) => a.toLowerCase() === b.toLowerCase();

/**
 * @desc takes an object with properties that might be promises and returns a promise of that object with resolved properties
 * @param  {Object} obj
 * @return {Promise}
 */
export const promisedProperties = obj => {
  const objectKeys = Object.keys(obj);
  return Promise.all(objectKeys.map(key => obj[key])).then(resolvedValues =>
    resolvedValues.reduce((resolvedObject, property, index) => {
      resolvedObject[objectKeys[index]] = property;
      return resolvedObject;
    }, obj)
  );
};

/**
 * @desc count the number of digits after the decimal
 * @param  {Number|String} value
 * @return {Promise}
 */
export const countDecimals = _value => {
  const value = Number(_value).toFixed(18);
  if (value % 1 !== 0) return value.toString().split('.')[1].length;
  return 0;
};

export const formatRound = (num, decimals = 2) =>
  isNaN(num)
    ? '----'
    : round(num, decimals).toLocaleString(
        {},
        { minimumFractionDigits: decimals }
      );

/**
 * @desc Copy a string to the clipboard. Requires a global document object.
 * @param  {String} string
 */
export const copyToClipboard = string => {
  const textArea = document.createElement('textarea');
  textArea.value = string;
  // lol
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('Copy');
  textArea.remove();
};

export const toBN = val => val.toBigNumber();

export const toNum = async promise => {
  const val = await promise;
  return val.toNumber();
};

export const uniqueId = () =>
  '_' +
  Math.random()
    .toString(36)
    .substr(2, 9);
