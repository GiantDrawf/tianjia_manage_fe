/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2020-11-17 15:16:36
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-15 17:28:45
 * @Description: 你 kin 你擦
 */
import { parse } from 'querystring';
import { useCallback, useRef } from 'react';
import { history } from 'umi';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * 检查是否有重定向地址
 */
export const checkRedirect = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#') + 1);
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  history.replace(redirect || '/');
};

/**
 * 获取文中所有图片
 * @param {string} str 文章内容
 * @param {boolean} filterUnLocalImg 是否筛选出非本地图片
 * @return {string[]} imgArr
 */
export const getImgSrcInContent = (str: string, filterUnLocalImg?: boolean): string[] => {
  if (!str) return [];
  const imgReg = /<img.*?(?:>|\/>)/gi; // 匹配img标签
  const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // 匹配src
  return (
    str
      .match(imgReg)
      ?.map((item: string) => {
        const result = item.match(srcReg);
        return result ? result[1] : '';
      })
      .filter((item: string) => item)
      .filter((item) => {
        if (filterUnLocalImg) {
          return (
            item.indexOf(
              process.env.NODE_ENV === 'development' ? 'localhost:8080/' : 'tianjia.live/static',
            ) < 0
          );
        }

        return true;
      }) || []
  );
};

/**
 * @description: 获取[start, end)之间的随机整数
 * @param {number} start 起始位置
 * @param {number} end 终止位置
 * @return {Number} random integer
 */
export const getRandomIntWithInRange = (start: number, end: number) =>
  Math.floor(Math.random() * (end - start)) + start;

export function useRefCallback<T extends (...args: any[]) => any>(callback: T) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}
