/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-03-16 09:41:03
 * @LastEditors: zhujian
 * @LastEditTime: 2021-03-16 10:30:38
 * @Description: 你 kin 你擦
 */
import useSWR from '@/hooks/useSWR';
import { PerformanceTypes } from '@/types/apiTypes';

const { apiBasePath } = process['CONFIG'];

/**
 * 获取系统各项性能指标
 * @param params
 */
export const usePerformance = () =>
  useSWR<{ data: PerformanceTypes }>([`${apiBasePath}/platform/performance`], {
    refreshInterval: 10000,
  });
