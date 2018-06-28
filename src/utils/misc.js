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
 * @return {String}
 */
export const cutMiddle = (text = "") => {
  return `${take(3, text)}...${takeLast(4, text)}`;
};
