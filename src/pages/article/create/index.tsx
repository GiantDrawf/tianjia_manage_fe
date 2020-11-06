import React, { useState } from 'react';
import { Button } from 'antd';
import { useParams } from 'umi';
import EditorBlock from '@/components/EditorBlock';
import { Article } from '@/types/apiTypes';
import styles from './index.less';

/**
 * 新建文章页面
 */
export default function CreateArticle() {
  const { aid } = useParams<{ aid: string | undefined }>();
  const [article] = useState<Article>();
  const [latestContent, setLatestContent] = useState<string>('');

  function handleSaveOrUpdate() {
    // setArticle({ content: '2' });
    console.log(latestContent);
  }

  function handleContentChange(newHtml: string) {
    setLatestContent(newHtml);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>1</div>
      <div className={styles.right}>
        <EditorBlock article={article} handleContentChange={handleContentChange} />
        <Button type="primary" className={styles.saveBtn} onClick={handleSaveOrUpdate}>
          {aid ? '更新' : '保存'}
        </Button>
      </div>
    </div>
  );
}
