/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-04-25 22:32:44
 * @LastEditors: zhujian
 * @LastEditTime: 2021-04-25 22:35:49
 * @Description: 你 kin 你擦
 */
import useSWR from '@/hooks/useSWR';
import request from '@/utils/request';
import { GetDouyinVideoParams, DouyinVideoItemList } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取视频列表
 * @param params
 */
export const useDouyinVideoList = (params: GetDouyinVideoParams) => {
  return useSWR<{ data: DouyinVideoItemList }>([`${apiBasePath}/platform/douyin/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });
};
