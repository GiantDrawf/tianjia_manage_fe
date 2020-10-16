import request from '@/utils/request';
import cookies from '@/utils/cookie';
import { AccountInfo } from '@/types/apiTypes';

const { apiBasePath, tokenKey } = process['CONFIG'];
// const token = cookies.get(tokenKey);

export interface LoginParamsType {
  name: string;
  password: string;
}

/**
 * 用户登录
 * @param params
 */
export async function accountLogin(params: LoginParamsType): Promise<AccountInfo> {
  return request(`${apiBasePath}/api/login`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取角色
 */
export async function getRole() {
  return request(`${apiBasePath}/api/getRole`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${cookies.get(tokenKey)}`,
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
