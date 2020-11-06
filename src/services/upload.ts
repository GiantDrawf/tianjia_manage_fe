import { UploadApi } from '@/types/apiTypes';
import request from '@/utils/request';

const { apiBasePath } = process['CONFIG'];

export async function upload(file: FormData): Promise<UploadApi> {
  return request(`${apiBasePath}/api/platform/upload`, {
    method: 'POST',
    data: file,
  });
}
