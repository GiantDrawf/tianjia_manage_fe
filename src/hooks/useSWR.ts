import { useRef } from 'react';
import useOldSWR from 'swr';
import type { ConfigInterface } from 'swr';
import request from '@/utils/request';

const defaultOption = {
  fetcher: request,
  revalidateOnFocus: false,
  shouldRetryOnError: false,
};

const useSWR = <T>(params1: any, configs?: ConfigInterface) => {
  const prevData = useRef<any>();
  const { ...option } = configs || {};
  const config = { ...defaultOption, ...option };

  const { data, isValidating, ...rest } = useOldSWR<T | undefined>(params1, config);

  // data为空时, 不重复渲染, 避免表格突然没数据
  if (data) {
    prevData.current = data;
  }

  return { data: prevData.current, isValidating, ...rest };
};

export default useSWR;
