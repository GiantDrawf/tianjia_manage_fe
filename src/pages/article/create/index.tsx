import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Col, Input, message, notification, Row } from 'antd';
import { useParams, history, Link } from 'umi';
import EditorBlock from '@/components/EditorBlock/asyncEditor';
import { Article, ModuleTypes } from '@/types/apiTypes';
import FormRender, { FormRefBindFunc } from '@/components/FormRender';
import { createArticle, getArticleDetail, updateActicle } from '@/services/article';
import styles from './index.less';
import { aidFormItem } from '@/utils/const';
import { getImgSrcInContent, getRandomIntWithInRange, useRefCallback } from '@/utils/utils';
import { getAllModules } from '@/services/module';

/**
 * 新建文章页面
 */
export default function CreateArticle() {
  const { aid } = useParams<{ aid: string | undefined }>();
  const [article, setArticle] = useState<Article | any>();
  const [latestContent, setLatestContent] = useState<string>('');
  const formRef = useRef<FormRefBindFunc>(null);
  const autoReturnTimer = useRef<any>(null);
  const [inputThumbTxt, setInputThumbTxt] = useState<string>('');
  const [allModules, setAllModules] = useState<ModuleTypes[]>([]);

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

    // 请求所有模块
    getAllModules().then((res) => {
      if (res && res.code === 200) {
        setAllModules(res.data || []);
      }
    });

    return () => {
      // 清楚定时器
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current);
      }
    };
  }, [aid]);

  const setArticleThumb = useRefCallback((thumbnail) => {
    formRef.current?.setFields([{ name: 'thumbnail', value: thumbnail }]);
  });

  /**
   * @description: 智能抓取缩略图
   * @return {void}
   */
  const intelligentGrabImg = useCallback(() => {
    const imgsInArticle = getImgSrcInContent(latestContent, false);
    const thumbnails = formRef.current?.getFieldValue('thumbnails') as string;
    const allImgsWaitForChoice = thumbnails
      ? imgsInArticle.concat(thumbnails.split(','))
      : imgsInArticle;

    if (allImgsWaitForChoice && allImgsWaitForChoice.length) {
      const randomInt = getRandomIntWithInRange(0, allImgsWaitForChoice.length);
      setArticleThumb(allImgsWaitForChoice[randomInt]);
    } else {
      notification['warning']({
        message: '智能抓取缩略图失败',
        description: (
          <div>
            <p>可能的原因: </p>
            {['1、文中无图片.', '3、文中图片未执行本地化操作', '3、未上传图片'].map(
              (itemReason: string, index: number) => (
                <p key={index}>{itemReason}</p>
              ),
            )}
          </div>
        ),
      });
    }
  }, [latestContent, setArticleThumb]);

  /**
   * @description: 输入框的值设置缩略图
   * @return {void}
   */
  const setThumbWithInput = useCallback(() => {
    if (inputThumbTxt) {
      setArticleThumb(inputThumbTxt);
    }
  }, [inputThumbTxt, setArticleThumb]);

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
        extra: (
          <Row align="middle">
            <Col md={{ span: 14 }} sm={24}>
              <Input
                size="small"
                allowClear
                onChange={(e) => setInputThumbTxt(e.target.value)}
                onPressEnter={setThumbWithInput}
              />
            </Col>
            <Col md={{ span: 10 }}>
              <Button
                disabled={!inputThumbTxt}
                size="small"
                type="primary"
                style={{ margin: '0px 5px' }}
                onClick={setThumbWithInput}
              >
                设置
              </Button>
              <Button size="small" type="primary" onClick={intelligentGrabImg}>
                智能抓取
              </Button>
            </Col>
            <p>
              仅可设置一张，用于微信分享展示(如未设置将尝试从图片中获取第一张)，格式png/jpg,
              大小200KB以内
              <a href="https://compressjpeg.com/zh/" target="_blank">
                点此去压缩
              </a>
            </p>
          </Row>
        ),
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
        extra: (
          <span>
            张数不限，格式png/jpg, 大小200KB以内
            <a href="https://compressjpeg.com/zh/" target="_blank">
              点此去压缩
            </a>
          </span>
        ),
      },
    },
    {
      name: 'inModules',
      label: '所属模块',
      renderCom: 'checkbox',
      span: 24,
      checkOptions: allModules.map((item) => ({
        label: (
          <Link to={`/module/edit/${item.mid}`} target="_blank">
            {item.moduleName}
          </Link>
        ),
        value: item.mid,
      })),
      itemProps: {
        extra: '可快速导入/移除模块(置顶操作需前往模块详情页)',
      },
    },
  ];

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
