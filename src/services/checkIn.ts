/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-03-05 10:15:38
 * @LastEditors: zhujian
 * @LastEditTime: 2021-03-05 14:33:02
 * @Description: 你 kin 你擦
 */
import useSWR from '@/hooks/useSWR';
import request from '@/utils/request';
import { GetCheckInListParams, CheckInList, BaseResponse } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取登记列表
 * @param params
 */
export const useCheckInList = (params: GetCheckInListParams) => {
  return useSWR<{ data: CheckInList }>([`${apiBasePath}/platform/checkin/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
    refreshInterval: 30000,
  });
};

/**
 * 删除登记
 * @param params
 */
export async function deleteCheckIn(_id: string): Promise<BaseResponse> {
  return request(`${apiBasePath}/platform/checkin/delete?id=${_id}`);
}

/**
 * 获取
 * @param params
 */
export const useAllPeopleNum = () => {
  return useSWR<{ data: CheckInList }>([`${apiBasePath}/platform/checkin/getAllNum`], {
    refreshInterval: 30000,
  });
};
