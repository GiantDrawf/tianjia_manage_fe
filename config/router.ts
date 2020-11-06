export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          // 根目录，默认重定向至欢迎页
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            hideInMenu: true,
            component: './Welcome',
          },
          // 文章管理
          {
            name: 'article',
            path: '/article',
            icon: 'picture',
            authority: ['admin'],
            routes: [
              // 新建文章
              {
                name: 'create',
                path: '/article/create',
                authority: ['admin'],
                component: './article/create/',
              },
              // 编辑文章(菜单隐藏)
              {
                name: 'edit',
                path: '/article/edit/:aid',
                authority: ['admin'],
                hideInMenu: true,
                component: './article/create/',
              },
              // 文章列表管理
              {
                name: 'management',
                path: '/article/management',
                authority: ['admin'],
                component: './article/',
              },
            ],
          },
          // 消息管理
          {
            name: 'notice',
            path: '/notice',
            icon: 'message',
            authority: ['admin'],
            component: './notice',
          },
          // 用户管理
          {
            name: 'usermanagement',
            path: '/usermanagement',
            icon: 'user',
            authority: ['admin'],
            component: './user/management',
          },
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
