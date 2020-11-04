import request from '@/utils/request';
import useSWR from '@/hooks/useSWR';
import { AllNotice, BaseResponse, GetNoticeParams } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取所有未读消息
 * @param params
 */
export async function getAllNoReadMsg(): Promise<AllNotice> {
  return request(`${apiBasePath}/api/platform/msg/getNoReadMsg`);
}

/**
 * 获取消息列表
 * @param params
 */
export const useNoticeList = (params: GetNoticeParams) => {
  return useSWR<{ data: AllNotice }>([`${apiBasePath}/api/common/msg/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });
};

/**
 * 控制消息展示
 * @param params
 */
export const changeNoticeShow = async (params: {
  msgId: string;
  isShow: boolean;
}): Promise<BaseResponse> => {
  return request(`${apiBasePath}/api/platform/msg/changeMsgShow`, { method: 'POST', data: params });
};

/**
 * 消息已读
 * @param params
 */
export async function readMsg(msgId: string): Promise<BaseResponse> {
  return request(`${apiBasePath}/api/platform/msg/readMsg?msgId=${msgId}`);
}

/**
 * 回复消息
 * @param params
 */
export const replayMsg = async (params: {
  msgId: string;
  replay: string;
}): Promise<BaseResponse> => {
  return request(`${apiBasePath}/api/platform/msg/replayMsg`, { method: 'POST', data: params });
};
