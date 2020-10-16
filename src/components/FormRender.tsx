import React, {
  ForwardRefRenderFunction,
  useImperativeHandle,
  MutableRefObject,
  forwardRef,
  useCallback,
} from 'react';
import { Form, Row, Col, Input, Select, DatePicker, TreeSelect } from 'antd';
import moment from 'moment';
import { LabeledValue } from 'antd/lib/select';
import { FieldData } from 'rc-field-form/lib/interface';

export interface FormItem {
  name: string;
  label: string;
  renderCom: 'input' | 'passwordInput' | 'select' | 'datePicker' | 'rangePicker' | 'treeSelect';
  comProps?: {
    options?: LabeledValue[];
    placeholder?: string;
    [propsName: string]: any;
  };
  span?: number;
  itemProps?: {};
}

export interface Props {
  ref: MutableRefObject<any>;
  items: FormItem[];
  onPressEnter: () => any;
  initialValues?: { [keyName: string]: any };
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
}

const FormRender: ForwardRefRenderFunction<unknown, Props> = (
  props: Props,
  ref: MutableRefObject<any>,
) => {
  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    resetFields: form.resetFields,
    getValues: form.validateFields,
    setFields: form.setFields,
  }));

  const getChildren = useCallback(
    ({ renderCom, comProps = {}, label }: FormItem) => {
      switch (renderCom) {
        case 'input':
          return (
            <Input placeholder={ comProps?.placeholder || `请输入${label}` }
              onPressEnter={ props.onPressEnter }
            />
          );
        case 'passwordInput':
          return (
            <Input.Password placeholder={ comProps?.placeholder ?? `请输入${label}` }
              onPressEnter={ props.onPressEnter }
            />
          );
        case 'select':
          return (
            <Select allowClear={ true }
              placeholder={ comProps?.placeholder ?? `请选择${label}` }
              onChange={ props.onPressEnter }
              showSearch={ comProps?.showSearch ?? false }
              filterOption={ (comProps?.showSearch && comProps?.filterOption) ?? null }>
              {comProps?.options?.map((item: LabeledValue) => (
                <Select.Option value={ item.value } key={ item.value }>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          );
        case 'datePicker':
          return <DatePicker { ...comProps } />;
        case 'rangePicker':
          return (
            <DatePicker.RangePicker showTime={ true }
              ranges={{
                今天: [moment().startOf('day'), moment().endOf('day')],
                昨天: [
                  moment()
                    .startOf('day')
                    .subtract(1, 'day'),
                  moment()
                    .endOf('day')
                    .subtract(1, 'day'),
                ],
                本周: [moment().startOf('week'), moment().endOf('week')],
                本月: [moment().startOf('month'), moment().endOf('month')],
              }}
            />
          );
        case 'treeSelect':
          return <TreeSelect { ...comProps }></TreeSelect>;
        default:
          return <Input />;
      }
    },
    [props.onPressEnter],
  );

  const handleFieldChange = useCallback(
    (changedFields: FieldData[], allFields: FieldData[]) => {
      props.onFieldsChange && props.onFieldsChange(changedFields, allFields);
    }, [props]);

  return (
    <Form form={ form } initialValues={ props.initialValues } onFieldsChange={ handleFieldChange }>
      <Row gutter={ 24 }>
        {props.items.map((item: FormItem) => {
          return (
            <Col span={ item.span ?? 8 } key={ item.name }>
              <Form.Item name={ item.name } label={ item.label } { ...item.itemProps }>
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
