import request from '@/utils/request';
import { AllNotice } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 删除用户
 * @param params
 */
export async function getAllNoReadMsg(): Promise<AllNotice> {
  return request(`${apiBasePath}/api/platform/msg/getNoReadMsg`);
}
