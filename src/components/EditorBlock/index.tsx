import React, { Component } from 'react';
import E from 'wangeditor';
import { message } from 'antd';
import { upload } from '@/services/upload';
import { Article } from '@/types/apiTypes';
import styles from './index.less';

interface Props {
  article?: Article;
  handleContentChange?: (newHtml: string) => void;
}

export default class Editor extends Component<Props, {}> {
  editor: any;

  constructor(props: Props) {
    super(props);

    this.editor = null;
  }

  componentDidMount() {
    const { article, handleContentChange } = this.props;
    const editor = new E('#content-editor');

    editor.config.height = 500;
    editor.config.zIndex = 1;

    // 菜单项
    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'lineHeight',
      'foreColor',
      'backColor',
      'link',
      'justify',
      'list',
      'quote',
      'emoticon',
      'image',
      'table',
      'splitLine',
      'undo',
      'redo',
    ];

    // 内容变更
    editor.config.onchange = (newHtml: string) => {
      handleContentChange && handleContentChange(newHtml);
    };

    editor.config.customUploadImg = async (
      resultFiles: File[],
      insertImgFn: (imguRL: string) => void,
    ) => {
      resultFiles.forEach((itemFile: File) => {
        const formData = new FormData();
        formData.append('file', itemFile);
        Promise.resolve(formData)
          .then(upload)
          .then((res) => {
            if (res && res.code === 200) {
              insertImgFn(res.data.url);
            } else {
              message.error(res.data);
            }
          })
          .catch((err) => message.error(err));
      });
    };

    editor.config.linkImgCheck = () => {
      // 警告提示
      message.warning('插入网络图片可能会导致无法正常显示!');

      return true;
    };

    editor.create();

    this.editor = editor;

    // 初始内容
    if (article && article.content) {
      editor.txt.html(article.content);
    }
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.article?.content !== this.props.article?.content;
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.article?.content !== this.props.article?.content) {
      this.editor.txt.html(this.props.article?.content);
    }
  }

  render() {
    return (
      <div className={styles.editorContainer}>
        <div id="content-editor" />
      </div>
    );
  }
}
