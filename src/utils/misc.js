import takeLast from 'ramda/src/takeLast';
import take from 'ramda/src/take';
import BigNumber from 'bignumber.js';

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
export const promiseRetry = ({ times, fn, delay }) => {
  return fn().catch(
    err =>
      times > 0
        ? promiseWait(delay).then(() =>
            promiseRetry({ times: times - 1, fn, delay })
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
 * @desc safely add 2 numbers
 * @param  {Number|String} a
 * @param  {Number|String} b
 * @return {String}
 */
export const add = (a, b) =>
  BigNumber(a)
    .plus(BigNumber(b))
    .toString();

export const subtract = (a, b) =>
  BigNumber(a)
    .minus(BigNumber(b))
    .toString();

export const mul = (a, b) =>
  BigNumber(a)
    .times(BigNumber(b))
    .toString();

/**
 * @desc make error messages more understandable
 * @param  {String} errorMsg
 * @return {String}
 */
export const cleanErrorMsg = errorMsg => {
  if (errorMsg.search('Error: ') === 0) {
    return errorMsg.replace('Error: ', '');
  } else return errorMsg;
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
