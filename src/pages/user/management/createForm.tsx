import React, { FC, Fragment, useState } from 'react';
import { Modal, Form, Input, Select, Checkbox, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { UserItem } from '@/types/apiTypes';
import { roleMap } from '@/utils/const';
import { addUser, checkName, updateUser } from '@/services/user';

const { Item: FormItem } = Form;
const { Option } = Select;

interface Props {
  visible: boolean;
  onClose: Function;
  refreshList: Function;
  userRecord: UserItem | { name?: string };
}

/**
 * 新建/更改用户
 * @param props
 */
const CreateForm: FC<Props> = (props: Props) => {
  const { visible, onClose, refreshList, userRecord = {} } = props;
  const [needChangePWD, setNeedChangePWD] = useState<boolean>(false);
  const [form] = Form.useForm();
  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 4 },
  };
  const isNew = !userRecord.name;

  const handleSubmit = async (): Promise<void> => {
    try {
      const fieldValues = await form.validateFields();
      const submitParams = {
        name: fieldValues.name,
        name_zh: fieldValues.name_zh,
        password: fieldValues.password,
        role: fieldValues.role,
      };
      const type = isNew ? 'create' : 'update';
      const fetcherFunc = type === 'create' ? addUser : updateUser;
      const res = await fetcherFunc(submitParams);
      if (res && res.code === 200) {
        message.success(res.msg);
        onClose();
        refreshList();
      } else {
        message.error(res?.msg || '系统错误');
        if (res.code === 303) {
          form.setFields([{ name: 'name', errors: [res.msg] }]);
        }
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  const checkUserName = async () => {
    const name = form.getFieldValue('name');
    const checkRes = await checkName(name);
    if (checkRes.code === 200) {
      form.setFields([{ name: 'name', errors: [] }]);
    } else {
      form.setFields([{ name: 'name', errors: [checkRes.msg] }]);
    }
  };

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={`${userRecord.name ? '编辑' : '新建'}用户`}
      onCancel={() => onClose()}
      onOk={handleSubmit}
    >
      <Form {...formLayout} form={form} initialValues={userRecord}>
        <FormItem
          label="用户名称"
          name="name"
          hasFeedback
          rules={[
            { required: true, message: '请填入用户名称!' },
            { max: 15, message: '用户名称不能超过15个字' },
          ]}
        >
          <Input
            placeholder="请输入用户名称"
            allowClear
            autoComplete="off"
            onBlur={checkUserName}
          />
        </FormItem>
        <FormItem
          label="中文名称"
          name="name_zh"
          hasFeedback
          rules={[{ max: 15, message: '中文名称不能超过15个字' }]}
        >
          <Input placeholder="请输入中文名称(选填)" allowClear autoComplete="off" />
        </FormItem>
        {isNew || (!isNew && needChangePWD) ? (
          <Fragment>
            <FormItem
              label="用户密码"
              name="password"
              hasFeedback
              rules={[{ required: true, message: '请输入用户密码!' }]}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="请输入密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </FormItem>
            <FormItem
              name="confirm"
              label="确认密码"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请再次确认密码',
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('两次输入的密码不一致!');
                  },
                }),
              ]}
            >
              <Input.Password
                autoComplete="new-password"
                placeholder="请再次输入密码"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </FormItem>
          </Fragment>
        ) : null}
        <FormItem
          label="用户权限"
          name="role"
          rules={[{ required: true, message: '请选择用户权限!' }]}
        >
          <Select style={{ width: 150 }} allowClear>
            {Object.keys(roleMap).map((itemRole: string) => (
              <Option value={itemRole} key={itemRole}>
                {roleMap[itemRole].label}
              </Option>
            ))}
          </Select>
        </FormItem>
        {!isNew ? (
          <Form.Item {...formTailLayout}>
            <Checkbox checked={needChangePWD} onChange={(e) => setNeedChangePWD(e.target.checked)}>
              是否修改密码
            </Checkbox>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default CreateForm;
