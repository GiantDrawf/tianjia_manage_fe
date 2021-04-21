import React, { FC, useRef, useState, ReactElement, CSSProperties, MutableRefObject } from 'react';
import { Button } from 'antd';
import { useUpdateEffect } from 'react-use';
import { FieldData } from 'rc-field-form/lib/interface';
import FormRender, { FormItem, FormItemLayout } from '../FormRender';
import Pagination from '../Pagination';
import styles from './index.less';

export type PageInfo = { pageNo: number; pageSize?: number };
export type OnSearch = { searchParam: { [keyname: string]: any }; pageInfo: PageInfo };

export interface Props {
  formItem: FormItem[];
  total: number;
  onSearch: (params: OnSearch) => any;
  children: ReactElement;
  plusAction?: ReactElement | ReactElement[];
  initialValues?: { [keyName: string]: any };
  actionsStyle?: CSSProperties;
  formRef?: MutableRefObject<any>;
  onFieldsChange?: (changedFields: FieldData[], allFields: FieldData[]) => void;
  formItemLayout?: FormItemLayout;
  formSize?: 'small' | 'middle' | 'large' | 'default';
}

const QueryList: FC<Props> = (props: Props) => {
  const {
    formItem,
    formSize = 'default',
    total,
    onSearch,
    children,
    plusAction,
    initialValues = {},
    actionsStyle = {},
    onFieldsChange,
    formItemLayout,
  } = props;
  const { pageNo: defaultPageNo, pageSize: defaultPageSize, ...defaultValues } = initialValues;
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageNo: defaultPageNo || 1,
    pageSize: defaultPageSize || 10,
  });
  const searchParam = useRef(defaultValues);
  const defaultRef = useRef<any>(null);
  const formRef = props.formRef !== undefined ? props.formRef : defaultRef;

  const search = async () => {
    try {
      searchParam.current = await formRef.current?.validateFields();
      setPageInfo((prevState: PageInfo) => ({ ...prevState, pageNo: 1 }));
    } catch (error) {
      console.error(error);
    }
  };

  // 仅在分页改变时才触发搜索, didMount不需要搜索
  useUpdateEffect(() => {
    onSearch({ searchParam: searchParam.current, pageInfo });
  }, [pageInfo, onSearch]);

  function handleReset() {
    formRef.current?.resetFields();
    search();
  }

  return (
    <div>
      <div className={styles.header}>
        <FormRender
          ref={formRef}
          formItemLayout={formItemLayout}
          formSize={formSize}
          items={formItem}
          onPressEnter={search}
          initialValues={defaultValues}
          onFieldsChange={onFieldsChange}
        />
        <div className={styles.actions} style={{ paddingBottom: '12px', ...actionsStyle }}>
          {plusAction || <div />}
          <div>
            <Button onClick={handleReset} key="reset" style={{ marginRight: '10px' }}>
              重置
            </Button>
            <Button onClick={search} type="primary" key="query">
              查询
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.body}>{children}</div>
      {total > 0 && (
        <Pagination
          total={total}
          pageSize={pageInfo.pageSize}
          current={pageInfo.pageNo}
          showSizeChanger
          onPageChange={(pageNo: number, pageSize?: number) => {
            setPageInfo({ pageNo, pageSize });
          }}
        />
      )}
    </div>
  );
};

export default QueryList;
