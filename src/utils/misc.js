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
export const cutMiddle = (text = "", left = 3, right = 4) => {
  return `${take(left, text)}${!!text ? "..." : ""}${takeLast(right, text)}`;
};
