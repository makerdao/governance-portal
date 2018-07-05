import takeLast from "ramda/src/takeLast";
import take from "ramda/src/take";

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
export const cutMiddle = (text = "", left = 3, right = 4) =>
  `${take(left, text)}${!!text ? "..." : ""}${takeLast(right, text)}`;

/**
 * @desc returns a url slugged version of some text
 * @param {String} text eg "New Topic"
 * @return {String} eg "new-topic"
 */
export const toSlug = text =>
  text
    .split(" ")
    .map(word => word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase())
    .join("-");

/**
 * @desc if the number is bigger than 1000, truncate and add a "k"
 * @param {Number|String} n number
 * @return {String}
 */
export const kFormat = n => {
  const num = parseFloat(n);
  return num > 999 ? (num / 1000).toFixed(1) + "k" : num.toFixed(2);
};

/**
 * @desc return a promise that resolves after specified time
 * @param {Number} time
 * @return {Promise}
 */
Promise.wait = time => new Promise(resolve => setTimeout(resolve, time || 0));

/**
 * @desc retry an async function a set number of times
 * @param  {Object} { times, fn, delay }
 * @return {Promise}
 */
Promise.retry = ({ times, fn, delay }) => {
  console.log(fn, "fn");
  return fn().catch(
    err =>
      times > 0
        ? Promise.wait(delay).then(() => Promise.retry(times - 1, fn, delay))
        : Promise.reject(err)
  );
};
