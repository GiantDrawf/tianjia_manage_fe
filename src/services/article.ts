import { AllArticle, Article, ArticleDetail, BaseResponse } from '@/types/apiTypes';
import request from '@/utils/request';
import useSWR from '@/hooks/useSWR';

const { apiBasePath } = process['CONFIG'];

/**
 * 新建文章
 * @param payload
 */
export const createArticle = async (payload: Article): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/article/create`, { method: 'POST', data: payload });

/**
 * 删除文章
 * @param aid
 */
export const deleteArticle = async (aid: string): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/article/delete?aid=${aid}`);

/**
 * 更改文章
 * @param payload
 */
export const updateActicle = async (payload: Article): Promise<BaseResponse> =>
  request(`${apiBasePath}/platform/article/update`, { method: 'POST', data: payload });

/**
 * 分页查询
 * @param params
 */
export const useArticleList = (params: any) =>
  useSWR<{ data: AllArticle }>([`${apiBasePath}/platform/article/query`, params], {
    fetcher: (url: string) =>
      request(url, {
        method: 'POST',
        data: params,
      }),
  });

/**
 * 获取文章详情
 * @param aid
 */
export async function getArticleDetail(aid: string): Promise<ArticleDetail> {
  return request(`${apiBasePath}/common/article/getDetail?aid=${aid}`);
}
