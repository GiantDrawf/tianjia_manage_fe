import React, { FC } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { NoticeItem } from '@/types/apiTypes';
import { replayMsg } from '@/services/notice';

const { Item: FormItem } = Form;
const { TextArea } = Input;

interface Props {
  visible: boolean;
  onClose: Function;
  refreshList: Function;
  noticeRecord: NoticeItem | null;
}

/**
 * 编辑回复
 * @param props
 */
const ReplayModal: FC<Props> = (props: Props) => {
  const { visible, onClose, refreshList, noticeRecord } = props;
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const fieldValues = await form.validateFields();
      if (noticeRecord?.msgId) {
        const submitReplay = {
          msgId: noticeRecord.msgId,
          replay: fieldValues.replay,
        };
        replayMsg(submitReplay).then((res) => {
          if (res.code === 200) {
            message.success('编辑回复成功');
            onClose();
            refreshList();
          } else {
            message.error(res.msg);
          }
        });
      } else {
        message.error('系统故障，请联系管理员！');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title="编辑回复"
      onCancel={() => onClose()}
      onOk={handleSubmit}
    >
      <Form {...formLayout} form={form} initialValues={noticeRecord ? { ...noticeRecord } : {}}>
        <FormItem label="消息标题" name="title">
          <Input disabled />
        </FormItem>
        <FormItem label="消息内容" name="content">
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} disabled />
        </FormItem>
        <FormItem
          label="回复"
          name="replay"
          rules={[{ required: true, message: '请填写回复内容！' }]}
        >
          <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ReplayModal;
