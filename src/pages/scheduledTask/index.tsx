/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2021-03-04 15:50:36
 * @LastEditors: zhujian
 * @LastEditTime: 2022-05-27 23:08:25
 * @Description: 你 kin 你擦
 */
import QueryList, { OnSearch } from '@/components/QueryList';
import { deleteTask, useTaskList } from '@/services/task';
import { GetTaskParams, TaskItem } from '@/types/apiTypes';
import { taskSearchFormItems } from '@/utils/const';
import { useRefCallback } from '@/utils/utils';
import { CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, message, Popconfirm, Row, Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { Fragment, useCallback, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useInterval } from 'react-use';
import ModifyTaskModal from './modifyTaskModal';

/**
 * 定时任务页面
 */
function ScheduledTask() {
  const [modifyTaskModalShow, setModifyTaskModalShow] = useState<boolean>(false);
  const [modifyTaskRecord, setModifyTaskRecord] = useState<TaskItem | null>(null);
  const [queryParams, setQueryParams] = useState<GetTaskParams>({
    query: {
      isCompleted: false,
    },
    pagination: {
      page: 1,
      pageSize: 50,
    },
    sort: {
      taskTriggerTime: 1, // 默认按照任务触发时间正序排
    },
  });
  const { isValidating: loading, data: listData, mutate: refreshList } = useTaskList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;
  const handleDeleteTask = (taskId?: string) => {
    if (taskId) {
      deleteTask(taskId)
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
  const handleModifyTaskModalShow = (modalShow: boolean, record: TaskItem | null = null) => {
    setModifyTaskModalShow(modalShow);
    setModifyTaskRecord(record);
  };
  const [now, setNowMoment] = useState(moment());

  useInterval(() => setNowMoment(moment()));

  const taskColumns = [
    {
      title: '任务Id',
      dataIndex: 'taskId',
      key: 'taskId',
      render: (taskId: string) => (
        <CopyToClipboard
          text={taskId}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('任务ID已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`taskId ${taskId}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: '任务描述',
      dataIndex: 'taskDesc',
      key: 'taskDesc',
    },
    {
      title: '触发时间',
      dataIndex: 'taskTriggerTime',
      key: 'taskTriggerTime',
      sorter: true,
    },
    {
      title: '倒计时',
      dataIndex: 'taskTriggerTime',
      key: 'countDown',
      render: (taskTriggerTime: string) => {
        if (moment().isSameOrAfter(moment(taskTriggerTime))) {
          return '已过期';
        }

        // 倒计时颜色
        let countDownColor = '#23a423';
        const diffDays = moment(taskTriggerTime).diff(now, 'days');
        const diffHours = moment(taskTriggerTime).diff(now, 'hours');
        const diffMins = moment(taskTriggerTime).diff(now, 'minutes');
        const diffSecs = moment(taskTriggerTime).diff(now, 'seconds');
        // 大于2小时以上，为绿色
        if (diffHours >= 1 && diffHours <= 2) {
          countDownColor = '#f1d10c';
        } else if (diffMins < 60 && diffMins >= 5) {
          countDownColor = '#f1510c';
        } else if (diffMins < 5) {
          countDownColor = 'red';
        }

        return (
          <span style={{ color: countDownColor }}>
            {diffDays}天{diffHours % 24}小时
            {diffMins % 60}分{diffSecs % 60}秒
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: TaskItem) => (
        <Row align="middle" style={{ minWidth: 100 }}>
          <Tooltip title="编辑任务">
            <EditOutlined
              onClick={(e) => {
                e.stopPropagation();
                handleModifyTaskModalShow(true, record);
              }}
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="删除任务">
            <Popconfirm
              title="确认删除该任务吗"
              okText="确认"
              cancelText="取消"
              onConfirm={() => handleDeleteTask(record.taskId)}
            >
              <DeleteOutlined />
            </Popconfirm>
          </Tooltip>
        </Row>
      ),
    },
  ];
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams((prevParams) => ({
      query: { isCompleted: false, ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 50,
      },
      sort: { ...prevParams.sort },
    }));
  }, []);
  const handleTableChange = useRefCallback((_, __, sorter) => {
    setQueryParams((prevParams) => ({
      ...prevParams,
      sort: {
        [`${sorter.field}`]: sorter.order === 'ascend' ? 1 : -1,
      },
    }));
  });

  return (
    <Fragment>
      <QueryList
        {...{
          initialValues: { pageSize: 10, isCompleted: false },
          formItem: taskSearchFormItems,
          total,
          onSearch,
          plusAction: (
            <Button type="primary" onClick={() => handleModifyTaskModalShow(true)}>
              新建任务
            </Button>
          ),
        }}
      >
        <Table
          locale={{ emptyText: '暂无任务' }}
          columns={taskColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="taskId"
          pagination={false}
          onChange={handleTableChange}
        />
      </QueryList>
      {modifyTaskModalShow && (
        <ModifyTaskModal
          visible={modifyTaskModalShow}
          onClose={() => handleModifyTaskModalShow(false)}
          refreshList={refreshList}
          taskRecord={modifyTaskRecord}
        />
      )}
    </Fragment>
  );
}

export default ScheduledTask;
