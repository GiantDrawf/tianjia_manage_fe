import React, { useCallback, useState } from 'react';
import QueryList, { OnSearch } from '@/components/QueryList';
import { Button, message, Popconfirm, Table } from 'antd';
import { history, Link } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { GetModuleParams, ModuleTypes } from '@/types/apiTypes';
import { deleteModule, useModuleList } from '@/services/module';
import { moduleSearchFormItems } from '@/utils/const';

/**
 * 文章管理
 */
export default function ArticleList() {
  const [queryParams, setQueryParams] = useState<GetModuleParams>({
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

  const { isValidating: loading, data: listData, mutate: refreshList } = useModuleList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;
  const handleDeleteModule = (mid: string) => {
    if (mid) {
      deleteModule(mid)
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
  const moduleColumns = [
    {
      title: '模块Id',
      dataIndex: 'mid',
      key: 'mid',
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
      title: '模块名称',
      dataIndex: 'moduleName',
      key: 'moduleName',
      render: (title: string, record: ModuleTypes) => (
        <Link to={`/module/edit/${record.mid}`}>{title}</Link>
      ),
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
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: ModuleTypes) => (
        <Popconfirm
          title="确认删除该模块吗"
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDeleteModule(record.mid)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  return (
    <QueryList
      {...{
        formItemLayout: { labelCol: { span: 5 }, wrapperCol: { span: 19 } },
        formItem: moduleSearchFormItems,
        total,
        onSearch,
        plusAction: (
          <Button type="primary" onClick={() => history.push('/module/edit')}>
            新建模块
          </Button>
        ),
      }}
    >
      <Table
        locale={{ emptyText: '暂无模块' }}
        columns={moduleColumns}
        loading={loading}
        dataSource={dataSource}
        rowKey="mid"
        pagination={false}
      />
    </QueryList>
  );
}
