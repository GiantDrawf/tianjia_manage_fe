import { UploadApi } from '@/types/apiTypes';
import request from '@/utils/request';

const { apiBasePath } = process['CONFIG'];

export async function upload(file: FormData): Promise<UploadApi> {
  return await request(`${apiBasePath}/platform/upload`, {
    method: 'POST',
    data: file,
  });
}

const UploadActionUrl = `${apiBasePath}/platform/upload`;

export { UploadActionUrl };
