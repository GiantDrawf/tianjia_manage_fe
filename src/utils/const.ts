export const roleMap = {
  admin: { label: '管理员', textColor: '#ff0000' },
  guest: { label: '游客', textColor: '#808080' },
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
    span: 5,
    renderCom: 'input',
  },
  {
    name: 'role',
    label: '角色',
    span: 5,
    renderCom: 'select',
    comProps: {
      options: Object.keys(roleMap).map((itemKey) => ({
        label: roleMap[itemKey].label,
        value: itemKey,
      })),
    },
  },
];
