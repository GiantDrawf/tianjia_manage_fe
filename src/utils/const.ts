export const roleMap = {
  admin: { label: '管理员', textColor: '#ff0000' },
  guest: { label: '游客', textColor: '#808080' },
};

export const aTypeMap = {
  article: { label: '普通文章' },
  slide: { label: '幻灯' },
};

export const noticeSearchFormItems = [
  {
    name: 'msgId',
    label: '消息Id',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'title',
    label: '标题',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'content',
    label: '内容',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'isRead',
    label: '是否已读',
    span: 3,
    renderCom: 'switch',
    comProps: {
      checkedChildren: '已读',
      unCheckedChildren: '未读',
    },
    itemProps: {
      valuePropName: 'checked',
      labelCol: { span: 12 },
    },
  },
  {
    name: 'isShow',
    label: '是否显示',
    span: 3,
    renderCom: 'switch',
    comProps: {
      checkedChildren: '展示',
      unCheckedChildren: '隐藏',
    },
    itemProps: {
      valuePropName: 'checked',
      labelCol: { span: 12 },
    },
  },
  {
    name: 'createTime',
    label: '创建时间',
    span: 8,
    renderCom: 'rangePicker',
  },
  {
    name: 'replayTime',
    label: '回复时间',
    span: 8,
    renderCom: 'rangePicker',
  },
];

export const userSearchFormItems = [
  {
    name: 'name',
    label: '用户名',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'role',
    label: '角色',
    span: 6,
    renderCom: 'select',
    comProps: {
      options: Object.keys(roleMap).map((itemKey) => ({
        label: roleMap[itemKey].label,
        value: itemKey,
      })),
    },
  },
];

export const articleSearchFormItems = [
  {
    name: 'aid',
    label: '文章id',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'title',
    label: '标题',
    span: 6,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
  {
    name: 'summary',
    label: '描述',
    span: 6,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
  {
    name: 'content',
    label: '内容',
    span: 6,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
  {
    name: 'type',
    label: '类型',
    span: 6,
    renderCom: 'select',
    comProps: {
      options: Object.keys(aTypeMap).map((itemKey) => ({
        label: aTypeMap[itemKey].label,
        value: itemKey,
      })),
    },
  },
  {
    name: 'creator',
    label: '创建人',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'updater',
    label: '更新人',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'createTime',
    label: '创建时间',
    span: 8,
    renderCom: 'rangePicker',
  },
  {
    name: 'updateTime',
    label: '更新时间',
    span: 8,
    renderCom: 'rangePicker',
  },
];

export const simpleArticleSearchFormItems = [
  {
    name: 'aid',
    label: '文章id',
    span: 12,
    renderCom: 'input',
  },
  {
    name: 'title',
    label: '标题',
    span: 12,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
  {
    name: 'summary',
    label: '描述',
    span: 12,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
  {
    name: 'content',
    label: '内容',
    span: 12,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
];

export const articleFormItems = [
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
export const aidFormItem = [
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

export const moduleSearchFormItems = [
  {
    name: 'mid',
    label: '模块id',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'moduleName',
    label: '模块名称',
    span: 6,
    renderCom: 'input',
    comProps: {
      placeholder: '支持模糊搜索',
    },
  },
];

export const midFormItem = [
  {
    name: 'mid',
    label: 'mid',
    renderCom: 'input',
    span: 24,
    itemProps: {
      hidden: true,
    },
    comProps: {
      disabled: true,
    },
  },
];

export const moduleFormItems = [
  {
    name: 'moduleName',
    label: '模块名称',
    renderCom: 'input',
    span: 24,
    itemProps: {
      rules: [{ required: true, message: '请填写标题' }],
    },
  },
  {
    name: 'moduleDesc',
    label: '模块介绍',
    renderCom: 'textArea',
    span: 24,
  },
];
