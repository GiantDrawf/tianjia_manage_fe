/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:32:44
 * @LastEditors: zhujian
 * @LastEditTime: 2021-05-09 23:05:52
 * @Description: 你 kin 你擦
 */
import useSWR from '@/hooks/useSWR';
import request from '@/utils/request';
import {
  GetDouyinVideoParams,
  DouyinVideoItemList,
  GetDouyinUserParams,
  DouyinUserItemList,
  BaseResponse,
} from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取视频列表
 * @param params
 */
export const useDouyinVideoList = (params: GetDouyinVideoParams) => {
  return useSWR<DouyinVideoItemList>([`${apiBasePath}/platform/douyin/video/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });
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

/**
 * @description: 离线下载所有视频数据
 */
export const downloadVideosOffline = (): Promise<BaseResponse> =>
  request(`${apiBasePath}/douyin/downloadVideosOffline`);

/**
 * @description: 离线下载所有账号数据
 */
export const downloadUsersOffline = (): Promise<BaseResponse> =>
  request(`${apiBasePath}/douyin/downloadUsersOffline`);
