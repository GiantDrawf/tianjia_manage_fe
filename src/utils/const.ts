export const roleMap = {
  guest: { label: '游客', textColor: '#808080' },
  admin: { label: '管理员', textColor: '#ff0000' },
  tianjia: { label: '天佳内容运营', textColor: '#ff0000' },
  douyin: { label: '抖音数据管理员', textColor: '#ff0000' },
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

export const checkInSearchFormItems = [
  {
    name: 'name',
    label: '姓名',
    span: 6,
    renderCom: 'input',
  },
  {
    name: 'telephone',
    label: '手机号',
    span: 6,
    renderCom: 'input',
  },
];

export const billboardTypesMap = {
  3: '体育',
  61: '二次元',
  71: '美食',
  81: '剧情',
  86: '搞笑',
  91: '旅游',
  101: '游戏',
  111: '汽车',
};

export const douyinVideoSearchFormItems = [
  {
    name: 'vid',
    label: '视频id',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'title',
    label: '视频标题',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'category',
    label: '分类',
    span: 8,
    renderCom: 'select',
    comProps: {
      options: Object.keys(billboardTypesMap).map((itemKey) => ({
        label: billboardTypesMap[itemKey],
        value: Number(itemKey),
      })),
    },
  },
  {
    name: 'author',
    label: '视频作者',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'uid',
    label: '作者id',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'music_author',
    label: 'BGM作者',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'create_time',
    label: '创建时间',
    span: 8,
    renderCom: 'rangePicker',
    comProps: {
      showTime: false,
    },
  },
  {
    name: 'isTrack',
    label: '是否跟踪',
    span: 8,
    renderCom: 'select',
    comProps: {
      options: [
        { label: '跟踪', value: true },
        { label: '不跟踪', value: false },
      ],
    },
  },
];

export const douyinUserSearchFormItems = [
  {
    name: 'uid',
    label: 'uid',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'sec_uid',
    label: 'sec_uid',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'author_name',
    label: '昵称',
    span: 8,
    renderCom: 'input',
  },
  {
    name: 'category',
    label: '分类',
    span: 8,
    renderCom: 'select',
    comProps: {
      options: Object.keys(billboardTypesMap).map((itemKey) => ({
        label: billboardTypesMap[itemKey],
        value: Number(itemKey),
      })),
    },
  },
  {
    name: 'isTrack',
    label: '是否跟踪',
    span: 8,
    renderCom: 'select',
    comProps: {
      options: [
        { label: '跟踪', value: true },
        { label: '不跟踪', value: false },
      ],
    },
  },
];
