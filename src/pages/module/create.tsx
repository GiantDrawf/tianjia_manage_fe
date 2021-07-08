import { useState, useRef, useEffect, Fragment, useCallback } from 'react';
import { Button, message, Popconfirm, Row, Checkbox, Table } from 'antd';
import { useParams, Link, history } from 'umi';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import type { Article, CreateModuleTypes, ImportArticle } from '@/types/apiTypes';
import FormRender from '@/components/FormRender';
import type { FormRefBindFunc } from '@/components/FormRender';
import { aTypeMap, midFormItem, moduleFormItems } from '@/utils/const';
import { createModule, getModuleDetail, updateModule } from '@/services/module';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import SelectArticleModal from '@/components/SelectArticleModal';
import { sortTopAndCreateTime } from '@/utils/utils';

export default function CreateModule() {
  const { mid } = useParams<{ mid: string | undefined }>();
  const [module, setModule] = useState<CreateModuleTypes | any>({ mid });
  const [articleListModalShow, setArticleListModalShow] = useState<boolean>(false);
  const [contentList, setContentList] = useState<ImportArticle[]>([]);
  const formRef = useRef<FormRefBindFunc>(null);
  const autoReturnTimer = useRef<any>(null);

  useEffect(() => {
    if (mid) {
      getModuleDetail(mid).then((res) => {
        if (res && res.code === 200) {
          const moduleInfo = res.data;
          const { moduleContent } = moduleInfo;

          setContentList(moduleContent);
          setModule(moduleInfo);
          // 重置表单加载初始值
          formRef.current?.resetFields();
        }
      });
    }

    return () => {
      // 清楚定时器
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current);
      }
    };
  }, [mid]);

  const handleDeleteArticle = useCallback(
    (aid: string) => {
      setContentList(contentList.filter((item) => item.aid !== aid));
    },
    [contentList],
  );

  const handleImportArticle = useCallback((newArticles: Article[]) => {
    setContentList((prevList: ImportArticle[]) => {
      const notRepeatArticles = newArticles
        .filter((newArticle) => {
          let notRepeat = true;

          prevList.forEach((oldArticle) => {
            if (oldArticle.aid === newArticle.aid) {
              notRepeat = false;
            }
          });

          return notRepeat;
        })
        .map((newArticle) => ({ ...newArticle, isTop: false }));

      if (notRepeatArticles.length === 0) {
        message.error('请勿重复导入文章!');
        return prevList;
      }

      message.success(
        `文章 ${notRepeatArticles.map((item) => `《${item.title}》`).join('、')} 导入成功`,
      );

      return sortTopAndCreateTime([...notRepeatArticles, ...prevList]);
    });
  }, []);

  const handleSaveOrUpdateModule = useCallback(() => {
    formRef.current
      ?.validateFields()
      .then((fields) => {
        // 精简文章保存数据
        function simpleArticleData(contentList: ImportArticle[]) {
          return contentList.map((item) => ({
            aid: item.aid,
            isTop: item.isTop || false,
            createTime: item.createTime,
          }));
        }

        return { ...fields, moduleContent: simpleArticleData(contentList as ImportArticle[]) };
      })
      .then(mid ? updateModule : createModule)
      .then((res) => {
        if (res.code === 200) {
          message.success(`${res.msg}, 2s后自动返回模块列表`);
          if (autoReturnTimer.current) {
            clearTimeout(autoReturnTimer.current);
          }
          autoReturnTimer.current = setTimeout(() => {
            history.push('/module');
          }, 2000);
        } else {
          message.error(res.msg || '模块保存失败，请稍后重试或联系系统管理员');
        }
      });
  }, [contentList, mid]);

  const handleArticleIsTopChange = useCallback(
    (checked: boolean, aid: string) => {
      const newContentList = (contentList as ImportArticle[]).map((itemArticle: ImportArticle) => ({
        ...itemArticle,
        isTop: aid === itemArticle.aid ? checked : itemArticle.isTop,
      }));
      setContentList(sortTopAndCreateTime([...newContentList]));
    },
    [contentList],
  );

  const contentColumns = [
    {
      title: '置顶',
      dataIndex: 'isTop',
      key: 'isTop',
      render: (isTop: boolean, record: ImportArticle) => (
        <Checkbox
          checked={isTop}
          onChange={(e) => handleArticleIsTopChange(e.target.checked, record.aid)}
        />
      ),
    },
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '文章Id',
      dataIndex: 'aid',
      key: 'aid',
      render: (aid: string) => (
        <CopyToClipboard
          text={aid}
          style={{ color: '#1890ff' }}
          onCopy={() => {
            message.success('id已复制到粘贴板');
          }}
        >
          <CopyOutlined title={`id ${aid}，点击可复制`} />
        </CopyToClipboard>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: Article) => (
        <Link to={`/article/edit/${record.aid}`} target="_blank">
          {title}
        </Link>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => aTypeMap[type]?.label || '未知类型',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: Article) => (
        <Popconfirm
          title="确认将该文章从模块中删除吗"
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDeleteArticle(record.aid)}
        >
          <DeleteOutlined />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Fragment>
      <FormRender
        initialValues={module}
        items={mid ? [...midFormItem, ...moduleFormItems] : moduleFormItems}
        ref={formRef}
        formItemLayout={{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}
      />
      <Row justify="space-between" style={{ marginBottom: 10 }}>
        <Button type="primary" onClick={() => setArticleListModalShow(true)}>
          添加文章
        </Button>
        <Button type="ghost" onClick={handleSaveOrUpdateModule}>
          保存模块
        </Button>
      </Row>
      <Table
        dataSource={contentList}
        columns={contentColumns}
        locale={{ emptyText: '暂无内容' }}
        rowKey="aid"
        pagination={false}
      />
      <SelectArticleModal
        modalVisible={articleListModalShow}
        onCancel={() => setArticleListModalShow(false)}
        handleImportArticle={handleImportArticle}
      />
    </Fragment>
  );
}
