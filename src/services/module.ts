/*
 * @Author: your name
 * @Date: 2020-11-30 17:03:22
 * @LastEditTime: 2021-07-06 15:09:12
 * @LastEditors: zhujian
 * @Description: In User Settings Edit
 * @FilePath: /tianjia_manage_fe/src/services/module.ts
 */
import { AllModule, BaseResponse, CreateModuleTypes, ModuleDetail } from '@/types/apiTypes';
import request from '@/utils/request';
import useSWR from '@/hooks/useSWR';

const { apiBasePath } = process['CONFIG'];

/**
 * 新建模块
 * @param payload
 */
export const createModule = async (payload: CreateModuleTypes): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/module/create`, { method: 'POST', data: payload });

/**
 * 更新模块
 * @param payload
 */
export const updateModule = async (payload: CreateModuleTypes): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/module/update`, { method: 'POST', data: payload });

/**
 * 分页查询
 * @param params
 */
export const useModuleList = (params: any) =>
  useSWR<{ data: AllModule }>([`${apiBasePath}/platform/module/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });

/**
 * 获取模块详情
 * @param aid
 */
export async function getModuleDetail(mid: string): Promise<ModuleDetail> {
  return request(`${apiBasePath}/common/module/getDetail`, { method: 'POST', data: { mid } });
}

/**
 * @description: 删除模块
 * @param {String} mid
 * @return {Promise<BaseResponse>}
 */
export const deleteModule = async (mid: string): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/module/delete?mid=${mid}`);

/**
 * 获取所有模块
 * @returns {Promise<AllModule>}
 */
export const getAllModules = async (): Promise<AllModule> =>
  request(`${apiBasePath}/platform/module/getAllModules`);
