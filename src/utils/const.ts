export const roleMap = {
  admin: { label: '管理员', textColor: '#ff0000' },
  guest: { label: '游客', textColor: '#808080' },
};

export const noticeSearchFormItems = [
  {
    name: 'title',
    label: '标题',
    span: 5,
    renderCom: 'input',
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
