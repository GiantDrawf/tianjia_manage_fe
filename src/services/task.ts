/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2022-05-27 01:18:01
 * @LastEditors: zhujian
 * @LastEditTime: 2022-05-27 01:25:56
 * @Description: 你 kin 你擦
 */
import { AllTask, BaseResponse, TaskItem } from '@/types/apiTypes';
import request from '@/utils/request';
import useSWR from '@/hooks/useSWR';

const { apiBasePath } = process['CONFIG'];

/**
 * 新建任务
 * @param payload
 */
export const createTask = async (payload: TaskItem): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/task/create`, { method: 'POST', data: payload });

/**
 * 删除任务
 * @param taskId
 */
export const deleteTask = async (taskId: string): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/task/delete?taskId=${taskId}`);

/**
 * 更改任务
 * @param payload
 */
export const updateTask = async (payload: TaskItem): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/task/update`, { method: 'POST', data: payload });

/**
 * 分页查询
 * @param params
 */
export const useTaskList = (params: any) =>
  useSWR<{ data: AllTask }>([`${apiBasePath}/platform/task/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });
