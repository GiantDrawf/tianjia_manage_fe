import React, { Fragment, useState, useCallback } from 'react';
import { connect } from 'umi';
import { Button, Divider, message, Popconfirm, Row, Table } from 'antd';
import { deleteUser, useUserList } from '@/services/user';
import { GetUserListParams, UserItem } from '@/types/apiTypes';
import { Role } from '@/types/pageTypes';
import { roleMap, userSearchFormItems } from '@/utils/const';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import QueryList, { OnSearch } from '@/components/QueryList';
import CreateForm from './createForm';
import { ConnectState } from '@/models/connect';

/**
 * 用户管理页面
 */
function UserManagement(props: { username: string }) {
  const { username } = props;
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [userItemRecord, setUserItemRecord] = useState<UserItem | {}>({});
  const [queryParams, setQueryParams] = useState<GetUserListParams>({
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
  const { isValidating: loading, data: listData, mutate: refreshList } = useUserList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;

  const handleUserChange = (record: UserItem) => {
    setUserItemRecord(record);
    setCreateModalVisible(true);
  };
  const handleDelete = async (record: UserItem) => {
    const { name } = record;
    const deleteRes = await deleteUser({ name });
    if (deleteRes && deleteRes.code === 200) {
      message.success(deleteRes.msg);
    } else {
      message.error(deleteRes?.msg || '删除用户失败,请稍后再试!');
    }
    refreshList();
  };
  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '中文名',
      dataIndex: 'name_zh',
      key: 'name_zh',
    },
    {
      title: '用户权限',
      dataIndex: 'role',
      key: 'role',
      render: (role: Role) =>
        roleMap[`${role}`] ? (
          <span style={{ color: roleMap[`${role}`].textColor }}>{roleMap[`${role}`].label}</span>
        ) : (
          '-'
        ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: UserItem) => (
        <Row>
          <EditOutlined onClick={() => handleUserChange(record)} />
          {record.name !== username ? (
            <Fragment>
              <Divider type="vertical" />
              <Popconfirm
                title="确认删除该用户?"
                onConfirm={() => handleDelete(record)}
                okText="确认删除"
                cancelText="取消"
              >
                <DeleteOutlined />
              </Popconfirm>
            </Fragment>
          ) : null}
        </Row>
      ),
    },
  ];

  const closeCreateModal = () => {
    setUserItemRecord({});
    setCreateModalVisible(false);
  };

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: userSearchFormItems,
          total,
          onSearch,
          plusAction: (
            <Button type="primary" onClick={() => setCreateModalVisible(true)}>
              新增用户
            </Button>
          ),
        }}
      >
        <Table
          columns={userColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="name"
          pagination={false}
        />
      </QueryList>
      {createModalVisible ? (
        <CreateForm
          visible={createModalVisible}
          onClose={closeCreateModal}
          refreshList={refreshList}
          userRecord={userItemRecord}
        />
      ) : null}
    </Fragment>
  );
}

export default connect(({ login }: ConnectState) => ({
  username: login.name,
}))(UserManagement);
