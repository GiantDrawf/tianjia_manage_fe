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
  return request(`${apiBasePath}/api/getRole`);
}
