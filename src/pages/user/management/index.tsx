import React, { Fragment, useState } from 'react';
import { Button, Divider, message, Popconfirm, Row, Table } from 'antd';
import { deleteUser, useUserList } from '@/services/user';
import { GetUserListParams, UserItem } from '@/types/apiTypes';
import { Role } from '@/types/pageTypes';
import { roleMap } from '@/utils/const';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import SearchForm from './searchForm';
import CreateForm from './createForm';

/**
 * 用户管理页面
 */
export default function UserManagement() {
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [userItemRecord, setUserItemRecord] = useState<UserItem | {}>({});
  const [queryParams, setQueryParams] = useState<GetUserListParams>({
    query: {},
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });
  const { isValidating: loading, data: listData, mutate: refreshList } = useUserList(queryParams);
  const dataSource = listData?.data?.list || [];
  const handlePageChange = (page: number, pageSize?: number) => {
    setQueryParams((prevQueryParams: GetUserListParams) => {
      return {
        ...prevQueryParams,
        pagination: { page, pageSize: pageSize || 10 },
      };
    });
  };
  const paginationProps = {
    current: queryParams.pagination.page,
    total: listData?.data?.pagination?.total || 0,
    showTotal: (total: number) => `共 ${total} 条`,
    pageSize: queryParams.pagination.pageSize,
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: handlePageChange,
    onShowSizeChange: handlePageChange,
  };
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
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除该用户?"
            onConfirm={() => handleDelete(record)}
            okText="确认删除"
            cancelText="取消"
          >
            <DeleteOutlined />
          </Popconfirm>
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
      <SearchForm
        setQueryParams={setQueryParams}
        newActionBtn={
          <Button type="primary" onClick={() => setCreateModalVisible(true)}>
            新增用户
          </Button>
        }
      />
      <Table
        columns={userColumns}
        loading={loading}
        dataSource={dataSource}
        rowKey="name"
        pagination={paginationProps}
      />
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
