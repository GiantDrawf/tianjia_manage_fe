import React, { Component } from 'react';
import E from 'wangeditor';
import { message, Spin } from 'antd';
import { upload, localizationImgs } from '@/services/upload';
import { Article } from '@/types/apiTypes';
import { getImgSrcInContent } from '@/utils/utils';
import styles from './index.less';

interface Props {
  article?: Article;
  handleContentChange?: (newHtml: string) => void;
}

interface StateTypes {
  editorLoading: boolean;
}

export default class Editor extends Component<Props, StateTypes> {
  editor: E | null;

  constructor(props: Props) {
    super(props);

    this.editor = null;

    this.state = {
      editorLoading: false,
    };
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
      const imgsInArticle = getImgSrcInContent(newHtml, true);
      if (imgsInArticle.length) {
        message.warning('文章内容含有非本地化图片，可能导致上线后无法正常显示！', 5);
      }
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

    // menu内填充按钮 - 一键本地化图片按钮
    editor.$toolbarElem.elems[0].appendChild(this.createLocalImgBtnElem());
  }

  handleLocalImgs(imgs: string[]) {
    this.setState({ editorLoading: true });
    localizationImgs(imgs)
      .then((res) => {
        if (res && res.code === 200) {
          // 获取原始内容进行地址替换
          let orginalHtml = this.editor?.txt.html() || '';
          Object.keys(res.data).forEach((originalUrl) => {
            orginalHtml = orginalHtml.replace(new RegExp(originalUrl, 'g'), res.data[originalUrl]);
          });
          this.editor?.txt.html(orginalHtml);
          message.success('图片本地化成功');
        } else {
          message.error(res.msg || '本地化失败，请联系系统管理员');
        }
      })
      .catch((err) => message.error(err))
      .finally(() => this.setState({ editorLoading: false }));
  }

  createLocalImgBtnElem() {
    const btnDiv = document.createElement('div');
    btnDiv.innerText = '一键本地化图片';
    btnDiv.className = styles.localImgBtn;
    btnDiv.addEventListener('click', () => {
      const orginalHtml = this.editor?.txt.html() || '';
      const imgsInArticle = getImgSrcInContent(orginalHtml, true);

      if (imgsInArticle.length) {
        this.handleLocalImgs(imgsInArticle);
      } else {
        message.warning('文中暂无外站图片，无需本地化~');
      }
    });

    return btnDiv;
  }

  componentWillUnmount() {
    this.editor?.destroy();
  }

  shouldComponentUpdate(nextProps: Props, nextState: StateTypes) {
    return (
      nextProps.article?.content !== this.props.article?.content ||
      nextState.editorLoading !== this.state.editorLoading
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.article?.content !== this.props.article?.content) {
      this.editor?.txt.html(this.props.article?.content);
    }
  }

  render() {
    const { editorLoading } = this.state;

    console.log(editorLoading);

    return (
      <Spin spinning={editorLoading} tip="加载中，请稍后...">
        <div id="content-editor" />
      </Spin>
    );
  }
}
