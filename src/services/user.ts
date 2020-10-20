import useSWR from '@/hooks/useSWR';
import request from '@/utils/request';
import { BaseResponse, GetUserListParams, UserItem, UserList } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取用户列表
 * @param params
 */
export const useUserList = (params: GetUserListParams) => {
  return useSWR<{ data: UserList }>([`${apiBasePath}/api/user/query`, params], {
    fetcher: (url: string) => request(url, { method: 'POST', data: params }),
  });
};

/**
 * 删除用户
 * @param params
 */
export async function deleteUser(params: { name: string }): Promise<BaseResponse> {
  return request(`${apiBasePath}/api/user/delete`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 更改用户信息
 * @param params
 */
export async function updateUser(params: UserItem): Promise<BaseResponse> {
  return request(`${apiBasePath}/api/user/update`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 新增用户
 * @param params
 */
export async function addUser(params: UserItem): Promise<BaseResponse> {
  return request(`${apiBasePath}/api/user/add`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 用户名查重
 * @param params
 */
export async function checkName(name: string): Promise<BaseResponse> {
  return request(`${apiBasePath}/api/user/checkname?name=${name}`);
}
