import { LocalizationImgRes, UploadApi } from '@/types/apiTypes';
import request from '@/utils/request';

const { apiBasePath } = process['CONFIG'];

export async function upload(file: FormData): Promise<UploadApi> {
  return await request(`${apiBasePath}/platform/upload`, {
    method: 'POST',
    data: file,
  });
}

const UploadActionUrl = `${apiBasePath}/platform/upload`;

/**
 * 本地化图片接口
 * @param images 图片地址参数
 */
export async function localizationImgs(images: string | string[]): Promise<LocalizationImgRes> {
  return await request(`${apiBasePath}/platform/localizeImgs`, {
    method: 'POST',
    data: {
      images,
    },
  });
}

export { UploadActionUrl };
