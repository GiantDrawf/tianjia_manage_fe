import React, {
  ForwardRefRenderFunction,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useCallback,
  ReactNode,
} from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  TreeSelect,
  Switch,
  Checkbox,
  Radio,
} from 'antd';
import moment from 'moment';
import { LabeledValue } from 'antd/lib/select';
import { FieldData, NamePath, ValidateFields } from 'rc-field-form/lib/interface';
import { FormLayout } from 'antd/lib/form/Form';
import Uploader from './Uploader';
import { SizeType } from 'antd/es/config-provider/SizeContext';

export interface FormItem {
  name: string;
  label: string;
  renderCom: string;
  comProps?: {
    options?: LabeledValue[];
    placeholder?: string;
    checkedChildren?: string | ReactNode;
    unCheckedChildren?: string | ReactNode;
    [propsName: string]: any;
  };
  span?: number;
  itemProps?: {};
  checkOptions?: { value: string; label: string | ReactNode }[];
}

export interface FormItemLayout {
  labelCol?: { span?: number; offset?: number };
  wrapperCol?: { span?: number; offset?: number };
}

export interface Props {
  ref: MutableRefObject<unknown> | any;
  items: FormItem[];
  formLayout?: FormLayout;
  formItemLayout?: FormItemLayout;
  formSize?: 'small' | 'middle' | 'large' | 'default';
  onPressEnter?: () => any;
  initialValues?: { [keyName: string]: any };
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
}

export interface FormRefBindFunc {
  resetFields: (fields?: NamePath[]) => void;
  validateFields: ValidateFields;
  setFields: (fields: FieldData[]) => void;
  getFieldValue: (name: NamePath) => any;
}

const FormRender: ForwardRefRenderFunction<unknown, Props> = (
  props: Props,
  ref: MutableRefObject<unknown> | any,
) => {
  const [form] = Form.useForm();
  const {
    formLayout = 'horizontal',
    formItemLayout = formLayout === 'horizontal'
      ? { labelCol: { span: 4 }, wrapperCol: { span: 20 } }
      : {},
    formSize = 'default',
    onPressEnter = () => {},
    onFieldsChange,
    initialValues,
    items,
  } = props;

  useImperativeHandle(ref, () => ({
    resetFields: form.resetFields,
    validateFields: form.validateFields,
    setFields: form.setFields,
    getFieldValue: form.getFieldValue,
  }));

  const getChildren = useCallback(
    ({ renderCom, comProps = {}, label, name, checkOptions }: FormItem) => {
      switch (renderCom) {
        case 'input':
        default:
          return (
            <Input
              placeholder={comProps?.placeholder || `请输入${label}`}
              onPressEnter={onPressEnter}
              {...comProps}
            />
          );
        case 'textArea':
          return (
            <Input.TextArea
              placeholder={comProps?.placeholder || `请输入${label}`}
              onPressEnter={onPressEnter}
              {...comProps}
            />
          );
        case 'passwordInput':
          return (
            <Input.Password
              placeholder={comProps?.placeholder ?? `请输入${label}`}
              onPressEnter={onPressEnter}
            />
          );
        case 'select':
          return (
            <Select
              allowClear
              placeholder={comProps?.placeholder ?? `请选择${label}`}
              onChange={onPressEnter}
              showSearch={comProps?.showSearch ?? false}
              filterOption={(comProps?.showSearch && comProps?.filterOption) ?? null}
            >
              {comProps?.options?.map((item: LabeledValue) => (
                <Select.Option value={item.value} key={item.value}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        case 'datePicker':
          return <DatePicker {...comProps} />;
        case 'rangePicker':
          return (
            <DatePicker.RangePicker
              showTime
              ranges={{
                今天: [moment().startOf('day'), moment().endOf('day')],
                昨天: [
                  moment().startOf('day').subtract(1, 'day'),
                  moment().endOf('day').subtract(1, 'day'),
                ],
                本周: [moment().startOf('week'), moment().endOf('week')],
                本月: [moment().startOf('month'), moment().endOf('month')],
              }}
            />
          );
        case 'treeSelect':
          return <TreeSelect {...comProps} />;
        case 'switch':
          return (
            <Switch
              checkedChildren={comProps?.checkedChildren}
              unCheckedChildren={comProps?.unCheckedChildren}
              onChange={onPressEnter}
            />
          );
        case 'upload':
          return (
            <Uploader
              {...comProps}
              accept="image/*"
              onInvalid={(errString: string) => form.setFields([{ name, errors: [errString] }])}
              clearErrors={() => form.setFields([{ name, errors: [] }])}
            />
          );
        case 'checkbox':
          return (
            <Checkbox.Group>
              {checkOptions?.map((item) => (
                <Checkbox value={item.value} key={item.value}>
                  {item.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          );
        case 'radio':
          return (
            <Radio.Group>
              {checkOptions?.map((item) => (
                <Radio value={item.value} key={item.value}>
                  {item.label}
                </Radio>
              ))}
            </Radio.Group>
          );
      }
    },
    [onPressEnter],
  );

  const handleFieldChange = useCallback(
    (changedFields: FieldData[], allFields: FieldData[]) => {
      onFieldsChange && onFieldsChange(changedFields, allFields);
    },
    [props],
  );

  return (
    <Form
      {...formItemLayout}
      layout={formLayout}
      form={form}
      initialValues={initialValues}
      onFieldsChange={handleFieldChange}
      size={formSize as SizeType}
    >
      <Row gutter={24}>
        {items.map((item: FormItem) => {
          const ColLayout = {
            span: item.span ?? 8,
            xs: 24,
            sm: 24,
            md: item.span && item.span > 12 ? item.span : 12,
            lg: item.span && item.span > 8 ? item.span : 8,
            xl: item.span ?? 6,
            xxl: item.span ?? 6,
          };

          return (
            <Col {...ColLayout} key={item.name}>
              <Form.Item name={item.name} label={item.label} {...item.itemProps}>
                {getChildren(item)}
              </Form.Item>
            </Col>
          );
        })}
      </Row>
    </Form>
  );
};

export default forwardRef(FormRender);
