import React, { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { useParams, history } from 'umi';
import EditorBlock from '@/components/EditorBlock';
import { Article } from '@/types/apiTypes';
import FormRender, { FormRefBindFunc } from '@/components/FormRender';
import { createArticle, getArticleDetail, updateActicle } from '@/services/article';
import styles from './index.less';

/**
 * 新建文章页面
 */
export default function CreateArticle() {
  const { aid } = useParams<{ aid: string | undefined }>();
  const [article, setArticle] = useState<Article | any>();
  const [latestContent, setLatestContent] = useState<string>('');
  const formRef = useRef<FormRefBindFunc>(null);

  function handleSaveOrUpdate() {
    formRef.current
      ?.validateFields()
      .then((values) => {
        if (values.thumbnails) {
          values.thumbnails = values.thumbnails.split(',');
        }

        return {
          ...values,
          content: latestContent,
        } as Article;
      })
      .catch((err) => {
        const { errorFields } = err;
        if (errorFields) {
          errorFields.forEach((itemField: { name: string[]; errors: string[] }) =>
            itemField.errors.forEach((itemerr) => message.error(itemerr)),
          );
        }

        return Promise.reject();
      })
      .then(aid ? updateActicle : createArticle)
      .then((res) => {
        if (res && res.code === 200) {
          message.success('保存成功，两秒后自动返回列表');
          setTimeout(() => history.push('/article'), 2000);
        } else {
          message.error(res.msg || '保存失败');
        }
      })
      .catch((err) => message.error(err));
  }

  function handleContentChange(newHtml: string) {
    setLatestContent(newHtml);
  }

  const articleFormItems = [
    {
      name: 'title',
      label: '标题',
      renderCom: 'input',
      span: 24,
      itemProps: {
        rules: [{ required: true, message: '请填写标题' }],
      },
    },
    {
      name: 'summary',
      label: '摘要',
      renderCom: 'textArea',
      span: 24,
    },
    {
      name: 'type',
      label: '类型',
      renderCom: 'radio',
      span: 24,
      checkOptions: [
        { label: '普通文章', value: 'article' },
        { label: '幻灯', value: 'slide' },
      ],
      itemProps: {
        rules: [{ required: true, message: '请选择类型' }],
      },
    },
    {
      name: 'thumbnail',
      label: '封面图',
      renderCom: 'upload',
      span: 24,
      comProps: {
        num: 1,
        maxSize: 200 * 1000,
      },
      itemProps: {
        valuePropName: 'initFileList',
        extra:
          '仅可设置一张，用于微信分享展示(如未设置将尝试从图片中获取第一张)，格式png/jpg, 大小200KB以内',
      },
    },
    {
      name: 'thumbnails',
      label: '图片',
      renderCom: 'upload',
      span: 24,
      comProps: {
        num: 0,
        maxSize: 200 * 1000,
        listType: 'picture',
      },
      itemProps: {
        valuePropName: 'initFileList',
        extra: '张数不限，格式png/jpg, 大小200KB以内',
      },
    },
  ];
  const aidFormItem = [
    {
      name: 'aid',
      label: 'aid',
      renderCom: 'input',
      span: 24,
      itemProps: {
        hidden: true,
      },
    },
  ];

  useEffect(() => {
    if (aid) {
      getArticleDetail(aid).then((res) => {
        if (res && res.code === 200) {
          const articleInfo = res.data;

          setArticle({
            ...articleInfo,
            thumbnails: articleInfo.thumbnails?.join(',') || '',
          });
          formRef.current?.resetFields();
        }
      });
    }
  }, [aid]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.classicInfo}>
          <FormRender
            initialValues={article}
            items={aid ? [...aidFormItem, ...articleFormItems] : articleFormItems}
            ref={formRef}
            formItemLayout={{ labelCol: { span: 3 }, wrapperCol: { span: 21 } }}
          />
        </div>
      </div>
      <div className={styles.right}>
        <EditorBlock article={article} handleContentChange={handleContentChange} />
        <Button type="primary" className={styles.saveBtn} onClick={handleSaveOrUpdate}>
          {aid ? '更新' : '保存'}
        </Button>
      </div>
    </div>
  );
}
