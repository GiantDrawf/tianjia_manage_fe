import React, { FC, ReactElement } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { roleMap } from '@/utils/const';
import { GetUserListParams } from '@/types/apiTypes';

const { Item: FormItem } = Form;
const { Option } = Select;

interface Props {
  setQueryParams: Function;
  newActionBtn?: ReactElement | ReactElement[];
}

/**
 * 搜索表单
 * @param props
 */
const SearchForm: FC<Props> = (props: Props) => {
  const { setQueryParams, newActionBtn } = props;
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };
  const [form] = Form.useForm();
  //   const handleFormFieldChange = (changedFields: FieldData[]) => {
  //     changedFields.forEach((itemChanged: FieldData) => {
  //       const paramKey = itemChanged.name[0];
  //       const { value } = itemChanged;
  //       setQueryParams((prevQueryParams: GetUserListParams) => ({
  //         ...prevQueryParams,
  //         query: {
  //           ...prevQueryParams.query,
  //           [paramKey]: value || undefined,
  //         },
  //       }));
  //     });
  //   };

  const handleReset = () => {
    form.resetFields();
    setQueryParams((prevQueryParams: GetUserListParams) => ({
      ...prevQueryParams,
      query: {},
    }));
  };
  const search = () => {
    const searchParams = form.getFieldsValue();
    setQueryParams((prevQueryParams: GetUserListParams) => ({
      ...prevQueryParams,
      query: {
        ...prevQueryParams.query,
        ...searchParams,
      },
    }));
  };
  return (
    <Row>
      <Form layout="inline" style={{ width: '100%' }} {...formLayout} form={form}>
        <FormItem label="用户名" name="name">
          <Input />
        </FormItem>
        <FormItem label="角色" name="role">
          <Select style={{ width: 150 }} allowClear>
            {Object.keys(roleMap).map((itemRole: string) => (
              <Option value={itemRole} key={itemRole}>
                {roleMap[itemRole].label}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
      <Row style={{ margin: '10px 0px', width: '100%' }}>
        <Col span={12}>{newActionBtn}</Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button onClick={search} type="primary" key="query" style={{ marginRight: 10 }}>
            查询
          </Button>
          <Button onClick={handleReset} key="reset">
            重置
          </Button>
        </Col>
      </Row>
    </Row>
  );
};

export default SearchForm;
