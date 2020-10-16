import React, { FC, useState, useEffect, useCallback } from 'react';
import { Pagination as AntdPagination } from 'antd';
import { PaginationProps as AntdPaginationProps } from 'antd/lib/pagination';

export interface PaginationProps extends AntdPaginationProps {
  onPageChange: (page: number, pageSize?: number) => void;
  styles?: any;
}

const defaultPageSizeOptions = ['10', '20', '50', '100'];
const showTotal = (total: number, range: number[]) => {
  return `共 ${total} 条  第${range[0]} ~ ${range[1]}条`;
};

const Pagination: FC<PaginationProps> = ({
  pageSize,
  current,
  pageSizeOptions,
  onPageChange,
  styles,
  ...props
}: PaginationProps) => {
  const [statePageSize, changePageSize] = useState(pageSize || 20);
  const [stateCurrent, changeCurrent] = useState(current || 1);

  const onChange = useCallback(
    (page: number, size?: number) => {
      if (size) {
        // 修改pagesize
        changePageSize(size);
      }
      changeCurrent(page);
      if (onPageChange) {
        onPageChange(page, size);
      }
    },
    [onPageChange],
  );

  useEffect(() => {
    current && changeCurrent(current);
  }, [current]);

  useEffect(() => {
    pageSize && changePageSize(pageSize);
  }, [pageSize]);

  return (
    <div
      style={{
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'flex-end',
        margin: '16px 0',
      }}
    >
      <AntdPagination
        {...{
          showTotal,
          ...props,
          onChange,
          pageSize: statePageSize,
          current: stateCurrent,
          onShowSizeChange: onChange,
          pageSizeOptions: pageSizeOptions || defaultPageSizeOptions,
        }}
      />
    </div>
  );
};

export default Pagination;
