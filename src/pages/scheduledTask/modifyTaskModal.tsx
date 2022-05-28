/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2022-05-27 02:02:34
 * @LastEditors: zhujian
 * @LastEditTime: 2022-05-27 15:50:32
 * @Description: 你 kin 你擦
 */
import React, { FC } from 'react';
import { Modal, Form, Input, DatePicker, message } from 'antd';
import { TaskItem } from '@/types/apiTypes';
import moment from 'moment';
import { createTask, updateTask } from '@/services/task';

const { Item: FormItem } = Form;
const { TextArea } = Input;

interface Props {
  visible: boolean;
  onClose: () => void;
  refreshList: () => void;
  taskRecord: TaskItem | null;
}

/**
 * 新建/修改任务
 * @param props
 */
const ModifyTaskModal: FC<Props> = (props: Props) => {
  const { visible, onClose, refreshList, taskRecord } = props;
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const taskId = taskRecord?.taskId;

  const handleSubmit = async (): Promise<void> => {
    form
      .validateFields()
      .then((fieldValues) =>
        Object.assign(
          {
            ...fieldValues,
            taskTriggerTime: moment(fieldValues.taskTriggerTime).format('YYYY-MM-DD HH:mm:ss'),
          },
          taskId ? { taskId } : {},
        ),
      )
      .then(taskId ? updateTask : createTask)
      .then((res) => {
        if (res.code === 200) {
          message.success(taskId ? '编辑任务成功' : '新建任务成功');
          onClose();
          refreshList();
        } else {
          message.error(res.msg);
        }
      })
      .catch((errorInfo) => {
        console.log('Failed:', errorInfo);
      });
  };

  return (
    <Modal
      destroyOnClose
      visible={visible}
      cancelText={taskId ? '取消编辑' : '取消新建'}
      okText={taskId ? '确认修改' : '新建'}
      title={taskRecord?.taskId ? '编辑任务' : '新建任务'}
      onCancel={onClose}
      onOk={handleSubmit}
    >
      <Form
        {...formLayout}
        form={form}
        initialValues={
          taskRecord
            ? {
                ...taskRecord,
                taskTriggerTime: taskRecord?.taskTriggerTime
                  ? moment(taskRecord.taskTriggerTime)
                  : undefined,
              }
            : {}
        }
      >
        <FormItem
          label="任务名称"
          name="taskName"
          rules={[{ required: true, message: '请填写任务名称！' }]}
        >
          <Input />
        </FormItem>
        <FormItem
          label="任务描述"
          name="taskDesc"
          rules={[{ required: true, message: '请填写任务描述！' }]}
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="任务描述，用于提醒文案" />
        </FormItem>
        <FormItem
          label="任务触发时间"
          name="taskTriggerTime"
          rules={[{ required: true, message: '请选择任务触发时间！' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ModifyTaskModal;
