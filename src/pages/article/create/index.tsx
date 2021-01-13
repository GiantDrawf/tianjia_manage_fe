import React, { useState, useRef, useEffect } from 'react';
import { Button, message } from 'antd';
import { useParams, history } from 'umi';
import EditorBlock from '@/components/EditorBlock/asyncEditor';
import { Article } from '@/types/apiTypes';
import FormRender, { FormRefBindFunc } from '@/components/FormRender';
import { createArticle, getArticleDetail, updateActicle } from '@/services/article';
import styles from './index.less';
import { aidFormItem, articleFormItems } from '@/utils/const';

/**
 * 新建文章页面
 */
export default function CreateArticle() {
  const { aid } = useParams<{ aid: string | undefined }>();
  const [article, setArticle] = useState<Article | any>();
  const [latestContent, setLatestContent] = useState<string>('');
  const formRef = useRef<FormRefBindFunc>(null);
  const autoReturnTimer = useRef<any>(null);

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
          if (autoReturnTimer.current) {
            clearTimeout(autoReturnTimer.current);
          }
          autoReturnTimer.current = setTimeout(() => {
            history.push('/article');
          }, 2000);
        } else {
          message.error(res.msg || '保存失败');
        }
      })
      .catch((err) => message.error(err));
  }

  function handleContentChange(newHtml: string) {
    setLatestContent(newHtml);
  }

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

    return () => {
      // 清楚定时器
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current);
      }
    };
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
