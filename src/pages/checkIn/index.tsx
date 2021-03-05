/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-03-04 15:50:36
 * @LastEditors: zhujian
 * @LastEditTime: 2021-03-05 14:44:40
 * @Description: 你 kin 你擦
 */
import React, { Fragment, useState, useCallback } from 'react';
import { message, Popconfirm, Table } from 'antd';
import { deleteCheckIn, useAllPeopleNum, useCheckInList } from '@/services/checkIn';
import { CheckInItem, GetUserListParams } from '@/types/apiTypes';
import { checkInSearchFormItems } from '@/utils/const';
import QueryList, { OnSearch } from '@/components/QueryList';
import { DeleteOutlined } from '@ant-design/icons';

/**
 * 登记管理页面
 */
function CheckInManagement() {
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
  const { isValidating: loading, data: listData, mutate: refreshList } = useCheckInList(
    queryParams,
  );
  const { data: numOfPeopleInfo, mutate: refreshNumberOfPeople } = useAllPeopleNum();
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;

  const handleDelete = async (record: CheckInItem) => {
    const { _id } = record;
    const deleteRes = await deleteCheckIn(_id);
    if (deleteRes && deleteRes.code === 200) {
      message.success(deleteRes.msg);
    } else {
      message.error(deleteRes?.msg || '登记删除失败,请稍后再试!');
    }
    refreshList();
    refreshNumberOfPeople();
  };

  const userColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '手机',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: '随行人数',
      dataIndex: 'numOfPeople',
      key: 'numOfPeople',
    },
    {
      title: '祝福语',
      dataIndex: 'blessing',
      key: 'blessing',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: CheckInItem) => (
        <Popconfirm
          title="确认删除该条登记?"
          onConfirm={() => handleDelete(record)}
          okText="确认删除"
          cancelText="取消"
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Fragment>
      <QueryList
        {...{
          formItem: checkInSearchFormItems,
          total,
          onSearch,
          plusAction: (
            <span style={{ paddingLeft: 10 }}>当前报名人数: {numOfPeopleInfo?.data || 0}</span>
          ),
        }}
      >
        <Table
          columns={userColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="telephone"
          pagination={false}
        />
      </QueryList>
    </Fragment>
  );
}

export default CheckInManagement;
