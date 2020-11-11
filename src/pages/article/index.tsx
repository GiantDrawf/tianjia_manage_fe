import React, { useCallback, useState } from 'react';
import QueryList, { OnSearch } from '@/components/QueryList';
import { articleSearchFormItems, aTypeMap } from '@/utils/const';
import { useArticleList } from '@/services/article';
import { Article, GetArticleParams } from '@/types/apiTypes';
import { Button, message, Table } from 'antd';
import { history, Link } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined } from '@ant-design/icons';

/**
 * 文章管理
 */
export default function ArticleList() {
  const [queryParams, setQueryParams] = useState<GetArticleParams>({
    query: {},
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams({
      query: { ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 10,
      },
    });
  }, []);
  const { isValidating: loading, data: listData } = useArticleList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;
  const articleColumns = [
    {
      title: 'Id',
      dataIndex: 'aid',
      key: 'aid',
      render: (aid: string) => (
        <CopyToClipboard
          text={aid}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('id已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`id ${aid}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Article) => (
        <Link to={`/article/edit/${record.aid}`}>{title}</Link>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => aTypeMap[type]?.label || '未知类型',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新人',
      dataIndex: 'updater',
      key: 'updater',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
  ];

  return (
    <QueryList
      {...{
        formItem: articleSearchFormItems,
        total,
        onSearch,
        plusAction: (
          <Button type="primary" onClick={() => history.push('/article/edit')}>
            新建文章
          </Button>
        ),
      }}
    >
      <Table
        locale={{ emptyText: '暂无文章' }}
        columns={articleColumns}
        loading={loading}
        dataSource={dataSource}
        rowKey="aid"
        pagination={false}
      />
    </QueryList>
  );
}
