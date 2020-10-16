const HOUR_TIME = 60 * 60 * 1000;

function getCookie(name: string | undefined) {
  let result = '';
  // 去掉空格
  const trimCookie = document.cookie.replace(/\s+/g, '');
  // 拆分成数组
  const cookieArr = trimCookie.split(';');
  // 组装成对象
  const cookieObj = {};

  cookieArr.forEach((item) => {
    const eachArr = item.split('=');
    const key = eachArr[0];
    const value = eachArr[1];

    cookieObj[key] = value;
  });

  if (name) {
    result = cookieObj[name];
  }

  return result;
}

/**
 * 设置 cookie
 * @param { string } name
 * @param { string } value
 * @param { object } options
 */
function setCookie(
  name: string,
  value: string,
  options: { domain?: string; secure?: boolean; expires?: any } = {},
) {
  let { expires } = options;

  if (!Number.isNaN(expires)) {
    const hours = expires;

    expires = new Date();
    expires.setTime(expires.getTime() + hours * HOUR_TIME);
  }

  // 保证网站全局可用
  const path = '/';

  const { domain } = options;

  document.cookie = [
    encodeURIComponent(name),
    '=',
    encodeURIComponent(value),
    expires ? `;expires=${expires.toUTCString()}` : '',
    `;path=${path}`,
    domain ? `;domain=${domain}` : '',
    options.secure ? ';secure' : '',
  ].join('');
}

function remove(key: string, options: any) {
  if (key === null) {
    return;
  }

  const option = options ? { ...options } : {};

  option.expires = null;
  setCookie(key, '', option);
}

export default {
  set: setCookie,
  get: getCookie,
  remove,
};
