/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:32:44
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-27 14:32:41
 * @Description: 你 kin 你擦
 */
import useSWR from '@/hooks/useSWR';
import request from '@/utils/request';
import {
  GetDouyinVideoParams,
  DouyinVideoItemList,
  GetDouyinUserParams,
  DouyinUserItemList,
} from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取视频列表
 * @param params
 */
export const useDouyinVideoList = (params: GetDouyinVideoParams) => {
  return useSWR<{ data: DouyinVideoItemList }>(
    [`${apiBasePath}/platform/douyin/video/query`, params],
    {
      fetcher: (url: string) =>
        request(url, {
          method: 'POST',
          data: params,
        }),
    },
  );
};

/**
 * 获取账号列表
 * @param params
 */
export const useDouyinUserList = (params: GetDouyinUserParams) => {
  return useSWR<{ data: DouyinUserItemList }>(
    [`${apiBasePath}/platform/douyin/user/query`, params],
    {
      fetcher: (url: string) =>
        request(url, {
          method: 'POST',
          data: params,
        }),
    },
  );
};

/**
 * @description: 获取分类下视频及账号
 * @return {Promise}
 */
export const getAllBillboard = () => request(`${apiBasePath}/douyin/getAllBillboard`);
