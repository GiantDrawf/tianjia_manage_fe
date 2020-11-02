import request from '@/utils/request';
import { AccountInfo } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

export interface LoginParamsType {
  name: string;
  password: string;
}

/**
 * 用户登录
 * @param params
 */
export async function accountLogin(params: LoginParamsType) {
  return request<AccountInfo>(`${apiBasePath}/api/platform/user/login`, {
    method: 'POST',
    data: params,
    noToken: true,
  });
}

/**
 * 获取角色
 */
export async function getRole() {
  return request(`${apiBasePath}/api/platform/user/getRole`);
}
