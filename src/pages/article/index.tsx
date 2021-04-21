import React, { useCallback, useState } from 'react';
import QueryList, { OnSearch } from '@/components/QueryList';
import { articleSearchFormItems, aTypeMap } from '@/utils/const';
import { deleteArticle, useArticleList } from '@/services/article';
import { Article, GetArticleParams } from '@/types/apiTypes';
import { Button, message, Popconfirm, Table } from 'antd';
import { history, Link } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

/**
 * 文章管理
 */
export default function ArticleList() {
  const [queryParams, setQueryParams] = useState<GetArticleParams>({
    query: {},
    pagination: {
      page: 1,
      pageSize: 50,
    },
    sort: {
      createTime: -1, // 默认按照创建时间倒序排
    },
  });
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams({
      query: { ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 50,
      },
    });
  }, []);

  const { isValidating: loading, data: listData, mutate: refreshList } = useArticleList(
    queryParams,
  );
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;
  const handleDeleteArticle = (aid: string) => {
    if (aid) {
      deleteArticle(aid)
        .then((res) => {
          if (res && res.code === 200) {
            message.success(res.msg || '删除成功');
          } else {
            message.error(res.msg || '删除失败，请联系系统管理员');
          }
        })
        .catch((err) => message.error(err))
        .finally(() => refreshList());
    }
  };
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
      sorter: true,
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
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: Article) => (
        <Popconfirm
          title="确认删除该文章吗"
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDeleteArticle(record.aid)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  const handleTableChange = useCallback((_, __, sorter) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      sort: {
        [`${sorter.field}`]: sorter.order === 'ascend' ? 1 : -1,
      },
    }));
  }, []);

  return (
    <QueryList
      {...{
        initialValues: { pageSize: 50 },
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
        onChange={handleTableChange}
      />
    </QueryList>
  );
}
