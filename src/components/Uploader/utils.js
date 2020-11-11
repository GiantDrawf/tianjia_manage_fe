import { message } from 'antd';

/**
 * 最大公约数
 * @param a
 * @param b
 */
export function maxDivisor(a, b) {
  return b === 0 ? a : maxDivisor(b, a % b);
}

export function checkRatio(file, realRatio, onerror) {
  return new Promise((resolve, reject) => {
    const wURL = window.URL || window.webkitURL;
    const testImg = new Image();
    testImg.onload = function () {
      const { height, width } = this;
      const divisor = maxDivisor(width, height);
      if (`${width / divisor}:${height / divisor}` !== `${realRatio}`) {
        onerror && onerror('图片宽高比错误');
        message.error('图片宽高比错误');
        reject();
      }
      resolve();
    };
    testImg.src = wURL.createObjectURL(file);
  });
}
